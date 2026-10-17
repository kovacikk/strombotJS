import { google, drive_v3 } from "googleapis";
import { GoogleAuth } from "googleapis-common";
import { ChatInputCommandInteraction, CacheType } from "discord.js";
import { DriveEmbedManager } from "./drive_embed";
import * as fs from "fs";

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const CREDENTIALS_PATH = "/app/service_account_credentials.json";

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  parent: string;
};

let auth: GoogleAuth | undefined = undefined;
let drive: drive_v3.Drive | undefined = undefined;

export function getDrive(keyFile?: string): drive_v3.Drive {
  if (!drive) {
    if (!auth) {
      auth = new google.auth.GoogleAuth({
        keyFile: keyFile ?? CREDENTIALS_PATH,
        scopes: SCOPES,
      });
    }

    drive = google.drive({ version: "v3", auth });
  }

  return drive;
}

export async function getFolderIdByName(folderName: string, parentId?: string) {
  const drive = getDrive();
  try {
    let query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;

    if (parentId) {
      query += ` and '${parentId}' in parents`;
    }

    const response = await drive.files.list({
      q: query,
      spaces: "drive",
      fields: "files(id, name)",
      pageSize: 1,
    });

    const files = response.data.files;

    if (!files || files.length === 0) {
      return null;
    }
    const folderId = files[0]?.id;

    return folderId;
  } catch (error) {
    console.error("Error finding folder:", error);
    throw error;
  }
}

export async function listFiles(folderId: string): Promise<DriveFile[]> {
  const drive = getDrive();
  let allFiles: DriveFile[] = [];
  let pageToken: string | null | undefined = undefined;

  try {
    do {
      const listParams: drive_v3.Params$Resource$Files$List = {
        q: `'${folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder' and trashed = false`,
        fields: "nextPageToken, files(id, name, mimeType, parents)",
        pageSize: 1000,
      };

      if (pageToken) {
        listParams.pageToken = pageToken;
      }

      const response = await drive.files.list(listParams);

      let files = response.data.files;
      if (files) {
        allFiles.push(...(files as DriveFile[]));
      }

      pageToken = response.data.nextPageToken || undefined;
    } while (pageToken);

    // Remove any files with missing information
    allFiles = allFiles
      .filter((file) => file.id && file.name && file.mimeType)
      .map((file) => {
        return {
          ...file,
          parent: folderId,
        };
      });
    return allFiles;
  } catch (error) {
    console.error("Error retrieving files", error);
  }

  return [];
}

async function downloadFiles(
  files: DriveFile[],
  mediaPath: string,
): Promise<DriveFile[]> {
  const drive = getDrive();

  const downloadedFiles: DriveFile[] = [];

  for (const file of files) {
    try {
      const fullPath = mediaPath + file.name;
      const stream = fs.createWriteStream(fullPath);

      const response = await drive.files.get(
        { fileId: file.id, alt: "media" },
        { responseType: "stream" },
      );

      await streamToFile(response.data as any, stream);

      downloadedFiles.push(file);
    } catch (error) {
      console.error(`Failed to download ${file.name}`, error);
    }
  }

  return downloadedFiles;
}

// Removes file from service account folder
// - Necessary because a service account cannot delete another users files
async function evictFiles(files: DriveFile[]): Promise<DriveFile[]> {
  const drive = getDrive();

  const evictedFiles: DriveFile[] = [];

  for (const file of files) {
    try {
      await drive.files.update({
        fileId: file.id,
        removeParents: file.parent,
        fields: "id",
      });
      evictedFiles.push(file);
    } catch (error) {
      console.error(`Error evicting file ${file.name}`, error);
    }
  }
  return evictedFiles;
}

// Deletes files from the drive (Puts them into the trash, not the full delete)
async function deleteFiles(files: DriveFile[]) {
  const drive = getDrive();

  const deletedFiles: DriveFile[] = [];

  for (const file of files) {
    try {
      await drive.files.update({
        fileId: file.id,
        requestBody: {
          trashed: true,
        },
      });

      deletedFiles.push(file);
    } catch (error) {
      console.error(`Failed to delete ${file.name}`, error);
    }
  }

  return deletedFiles;
}

export async function downloadAndEvictFiles(
  files: DriveFile[],
  mediaPath: string,
  driveEmbed: DriveEmbedManager,
): Promise<void> {
  for (const file of files) {
    try {
      driveEmbed.updateProgress(file.name, false);
      await driveEmbed.refresh();

      const download = await downloadFiles([file], mediaPath);
      if (download.length <= 0) {
        continue;
      }

      const eviction = await evictFiles([file]);
      if (eviction.length <= 0) {
        continue;
      }

      driveEmbed.updateProgress(file.name);
    } catch (error) {
      continue;
    }
  }
}

function streamToFile(
  readableStream: any,
  writeStream: fs.WriteStream,
): Promise<void> {
  return new Promise((resolve, reject) => {
    readableStream
      .on("error", (err: any) => {
        writeStream.close();
        reject(err);
      })
      .pipe(writeStream)
      .on("finish", () => {
        resolve();
      })
      .on("error", (err: any) => {
        reject(err);
      });
  });
}
