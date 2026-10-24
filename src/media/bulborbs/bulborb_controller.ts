import {
  getBulborbs,
  insertBulborbs,
  deleteBulborbs,
} from "../../data/data_controller";
import { Bulborb } from "../../data/entities/Bulborb";
import { getFileNames } from "../media_controller";
import { listFiles, downloadAndEvictFiles } from "../../drive/drive_controller";
import { getBulborbsByName } from "../../data/data_controller";
import { DriveResults } from "../../media/media_controller";
import {
  DriveEmbedManager,
  DriveItem,
  driveState,
} from "../../drive/drive_embed";
import { ChatInputCommandInteraction, CacheType } from "discord.js";
import { MAX_FILE_SIZE } from "../media_types";

export const BULBORB_PATH = "/app/media/bulborbs/";
const BULBORB_DRIVE_FOLDER_ID = "1AVyX2L8Tp0LFumKGB_aYyxk2sR9cXJS9";

// Compares files and database to insert new bulborbs and delete old ones
export async function sync(): Promise<void> {
  const databaseBulborbs = await getBulborbs();

  const bulborbMap: Record<string, Bulborb> = {};
  for (const bulborb of databaseBulborbs) {
    bulborbMap[bulborb.name] = bulborb;
  }
  const databaseBulborbNames = (await getBulborbs()).map(
    (bulborb) => bulborb.name,
  );

  const fileBulborbs = getFileNames(BULBORB_PATH);

  const newFiles = fileBulborbs.filter(
    (bulborb) => !databaseBulborbNames.includes(bulborb),
  );
  const deletedFiles = databaseBulborbNames.filter(
    (bulborb) => !fileBulborbs.includes(bulborb),
  );

  if (newFiles.length > 0) {
    await insertBulborbs(
      newFiles.map((file) =>
        Object.assign(new Bulborb(), {
          name: file,
          path: `${BULBORB_PATH}${file}`,
        }),
      ),
    );
    console.log(`${newFiles.length} new bulborbs inserted`);
  }

  if (deletedFiles.length > 0) {
    await deleteBulborbs(deletedFiles);
    console.log(`${deletedFiles.length} old bulborbs deleted`);
  }
}

export async function checkDrive(
  driveEmbed: DriveEmbedManager,
): Promise<DriveResults> {
  // Get New Files in Google Drive
  const files = await listFiles(BULBORB_DRIVE_FOLDER_ID);

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
  const existingBulborbs = await getBulborbsByName(fileNames);
  const existingSet = new Set();
  for (const existing of existingBulborbs) {
    existingSet.add(existing.name);
  }
  console.log(`${existingBulborbs.length} duplicate name(s) found`);

  // Filter out those matches
  const newFiles = files.filter(
    (file) =>
      file?.name &&
      !existingSet.has(file?.name) &&
      !largeFilesSet.has(file?.name),
  );

  let driveItem: DriveItem = {
    name: "Bulborb",
    downloading: newFiles.length,
    downloaded: 0,
    duplicates: existingBulborbs.length,
    largeFiles: largeFiles.length,
  };
  driveEmbed.setState(driveState.Downloading).setCurrentItem(driveItem);

  // Download new and delete drive files
  await downloadAndEvictFiles(newFiles, BULBORB_PATH, driveEmbed);
  console.log(`${newFiles.length} new file(s) downloaded`);

  await sync();

  driveEmbed.completeCurrentItem();
  await driveEmbed.refresh();

  return {
    name: "Bulborbs",
    duplicates: existingBulborbs.flatMap((bulborb) => bulborb.name),
    largeFiles: largeFiles.flatMap((largeFile) => largeFile.name),
    new: newFiles.map((file) => file.name),
  };
}
