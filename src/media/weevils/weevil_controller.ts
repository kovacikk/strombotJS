import {
  getItems,
  insertItems,
  deleteItemsByField,
} from "../../data/data_controller";
import { Weevil } from "../../data/entities/Weevil";
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

export const WEEVIL_PATH = "/app/media/weevils/";
const WEEVIL_DRIVE_FOLDER_ID = "18cz_oR9qUhZhJo1EqeMlDLSfa66MRDGa";

// Compares files and database to insert new weevils and delete old ones
export async function sync(): Promise<void> {
  const databaseWeevils = await getItems(Weevil);

  const weevilMap: Record<string, Weevil> = {};
  for (const weevil of databaseWeevils) {
    weevilMap[weevil.name] = weevil;
  }
  const databaseWeevilNames = (await getItems(Weevil)).map(
    (weevil) => weevil.name,
  );

  const fileWeevils = getFileNames(WEEVIL_PATH);

  const newFiles = fileWeevils.filter(
    (weevil) => !databaseWeevilNames.includes(weevil),
  );
  const deletedFiles = databaseWeevilNames.filter(
    (weevil) => !fileWeevils.includes(weevil),
  );

  if (newFiles.length > 0) {
    await insertItems(
      Weevil,
      newFiles.map((file) =>
        Object.assign(new Weevil(), {
          name: file,
          path: `${WEEVIL_PATH}${file}`,
        }),
      ),
    );
    console.log(`${newFiles.length} new weevils inserted`);
  }

  if (deletedFiles.length > 0) {
    await deleteItemsByField(Weevil, deletedFiles, "name");
    console.log(`${deletedFiles.length} old weevils deleted`);
  }
}

export async function checkDrive(
  driveEmbed: DriveEmbedManager,
): Promise<DriveResults> {
  // Get New Files in Google Drive
  const files = await listFiles(WEEVIL_DRIVE_FOLDER_ID);

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
  const existingWeevils = await getItemsByField(Weevil, fileNames, "name");
  const existingSet = new Set();
  for (const existing of existingWeevils) {
    existingSet.add(existing.name);
  }
  console.log(`${existingWeevils.length} duplicate name(s) found`);

  // Filter out those matches
  const newFiles = files.filter(
    (file) =>
      file?.name &&
      !existingSet.has(file?.name) &&
      !largeFilesSet.has(file?.name),
  );

  let driveItem: DriveItem = {
    name: "Weevil",
    downloading: newFiles.length,
    downloaded: 0,
    duplicates: existingWeevils.length,
    largeFiles: largeFiles.length,
  };
  driveEmbed.setState(driveState.Downloading).setCurrentItem(driveItem);

  // Download new and delete drive files
  await downloadAndEvictFiles(newFiles, WEEVIL_PATH, driveEmbed);
  console.log(`${newFiles.length} new file(s) downloaded`);

  await sync();

  driveEmbed.completeCurrentItem();
  await driveEmbed.refresh();

  return {
    name: "Weevils",
    duplicates: existingWeevils.flatMap((weevil) => weevil.name),
    largeFiles: largeFiles.flatMap((largeFile) => largeFile.name),
    new: newFiles.map((file) => file.name),
  };
}
