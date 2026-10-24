import {
  getItems,
  insertItems,
  deleteItemsByField,
} from "../../data/data_controller";
import { Cat } from "../../data/entities/Cat";
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

export const CAT_PATH = "/app/media/cats/";
const CAT_DRIVE_FOLDER_ID = "1RyGoPvqWRH9m4xQN02GVvBkez6CHmk7t";

// Compares files and database to insert new cats and delete old ones
export async function sync(): Promise<void> {
  const databaseCats = await getItems(Cat);

  const catMap: Record<string, Cat> = {};
  for (const cat of databaseCats) {
    catMap[cat.name] = cat;
  }
  const databaseCatNames = (await getItems(Cat)).map((cat) => cat.name);

  const fileCats = getFileNames(CAT_PATH);

  const newFiles = fileCats.filter((cat) => !databaseCatNames.includes(cat));
  const deletedFiles = databaseCatNames.filter(
    (cat) => !fileCats.includes(cat),
  );

  if (newFiles.length > 0) {
    await insertItems(
      Cat,
      newFiles.map((file) =>
        Object.assign(new Cat(), {
          name: file,
          path: `${CAT_PATH}${file}`,
        }),
      ),
    );
    console.log(`${newFiles.length} new cats inserted`);
  }

  if (deletedFiles.length > 0) {
    await deleteItemsByField(Cat, deletedFiles, "name");
    console.log(`${deletedFiles.length} old cats deleted`);
  }
}

export async function checkDrive(
  driveEmbed: DriveEmbedManager,
): Promise<DriveResults> {
  // Get New Files in Google Drive
  const files = await listFiles(CAT_DRIVE_FOLDER_ID);

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
  const existingCats = await getItemsByField(Cat, fileNames, "name");
  const existingSet = new Set();
  for (const existing of existingCats) {
    existingSet.add(existing.name);
  }
  console.log(`${existingCats.length} duplicate name(s) found`);

  // Filter out those matches
  const newFiles = files.filter(
    (file) =>
      file?.name &&
      !existingSet.has(file?.name) &&
      !largeFilesSet.has(file?.name),
  );

  let driveItem: DriveItem = {
    name: "Cat",
    downloading: newFiles.length,
    downloaded: 0,
    duplicates: existingCats.length,
    largeFiles: largeFiles.length,
  };
  driveEmbed.setState(driveState.Downloading).setCurrentItem(driveItem);

  // Download new and delete drive files
  await downloadAndEvictFiles(newFiles, CAT_PATH, driveEmbed);
  console.log(`${newFiles.length} new file(s) downloaded`);

  await sync();

  driveEmbed.completeCurrentItem();
  await driveEmbed.refresh();

  return {
    name: "Cats",
    duplicates: existingCats.flatMap((cat) => cat.name),
    largeFiles: largeFiles.flatMap((largeFile) => largeFile.name),
    new: newFiles.map((file) => file.name),
  };
}
