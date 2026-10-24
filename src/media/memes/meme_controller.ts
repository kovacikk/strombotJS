import {
  getItems,
  insertItems,
  deleteItemsByField,
} from "../../data/data_controller";
import { Meme } from "../../data/entities/Meme";
import { getFileNames } from "../media_controller";
import { listFiles, downloadAndEvictFiles } from "../../drive/drive_controller";
import { getItemsByField } from "../../data/data_controller";
import { DriveResults } from "../media_controller";
import {
  DriveEmbedManager,
  DriveItem,
  driveState,
} from "../../drive/drive_embed";
import { MAX_FILE_SIZE } from "../media_types";

export const MEME_PATH = "/app/media/memes/";
const MEME_DRIVE_FOLDER_ID = "1wd_KRGLDe7N3taKclTwUERDZrpOCSWOo";

// Compares files and database to insert new memes and delete old ones
export async function sync(): Promise<void> {
  const databaseMemes = await getItems(Meme);

  const memeMap: Record<string, Meme> = {};
  for (const meme of databaseMemes) {
    memeMap[meme.name] = meme;
  }
  const databaseMemeNames = (await getItems(Meme)).map((meme) => meme.name);

  const fileMemes = getFileNames(MEME_PATH);

  const newFiles = fileMemes.filter(
    (meme) => !databaseMemeNames.includes(meme),
  );
  const deletedFiles = databaseMemeNames.filter(
    (meme) => !fileMemes.includes(meme),
  );

  if (newFiles.length > 0) {
    await insertItems(
      Meme,
      newFiles.map((file) =>
        Object.assign(new Meme(), {
          name: file,
          path: `${MEME_PATH}${file}`,
        }),
      ),
    );
    console.log(`${newFiles.length} new memes inserted`);
  }

  if (deletedFiles.length > 0) {
    await deleteItemsByField(Meme, deletedFiles, "name");
    console.log(`${deletedFiles.length} old memes deleted`);
  }
}

export async function checkDrive(
  driveEmbed: DriveEmbedManager,
): Promise<DriveResults> {
  // Get New Files in Google Drive
  const files = await listFiles(MEME_DRIVE_FOLDER_ID);

  // Reject any files bigger than 20MB
  const largeFiles = files.filter((file) => {
    const sizeInBytes = file.size ? Number(file.size) : 0;
    return sizeInBytes > MAX_FILE_SIZE;
  });
  const largeFilesSet = new Set();
  for (const largeFile of largeFiles) {
    largeFilesSet.add(largeFile.name);
  }
  console.log(`${largeFiles.length} large file(s) found`);

  // Find any google drive files with the same name in the database
  const fileNames: string[] = files.map((file) => file.name);
  const existingMemes = await getItemsByField(Meme, fileNames, "name");
  const existingSet = new Set();
  for (const existing of existingMemes) {
    existingSet.add(existing.name);
  }
  console.log(`${existingMemes.length} duplicate name(s) found`);

  // Filter out those matches
  const newFiles = files.filter(
    (file) =>
      file?.name &&
      !existingSet.has(file?.name) &&
      !largeFilesSet.has(file?.name),
  );

  let driveItem: DriveItem = {
    name: "Meme",
    downloading: newFiles.length,
    downloaded: 0,
    duplicates: existingMemes.length,
    largeFiles: largeFiles.length,
  };
  driveEmbed.setState(driveState.Downloading).setCurrentItem(driveItem);

  // Download new and delete drive files
  await downloadAndEvictFiles(newFiles, MEME_PATH, driveEmbed);
  console.log(`${newFiles.length} new file(s) downloaded`);

  await sync();

  driveEmbed.completeCurrentItem();
  await driveEmbed.refresh();

  return {
    name: "Memes",
    duplicates: existingMemes.flatMap((meme) => meme.name),
    largeFiles: largeFiles.flatMap((largeFile) => largeFile.name),
    new: newFiles.map((file) => file.name),
  };
}
