import {
  getWeevils,
  insertWeevils,
  deleteWeevils,
} from "../../data/data_controller";
import { Weevil } from "../../data/entities/Weevil";
import { getFileNames } from "../media_controller";
import {
  listFiles,
  downloadAndEvictFiles,
} from "../../drive/drive_controller.js";
import { getWeevilsByName } from "../../data/data_controller.js";
import { DriveResults } from "../media_controller";
import {
  DriveEmbedManager,
  driveItem,
  driveState,
} from "../../drive/drive_embed";

const WEEVIL_PATH = "/app/media/weevils/";
const WEEVIL_DRIVE_FOLDER_ID = "18cz_oR9qUhZhJo1EqeMlDLSfa66MRDGa";

// Compares files and database to insert new weevils and delete old ones
export async function sync(): Promise<void> {
  const databaseWeevils = await getWeevils();

  const weevilMap: Record<string, Weevil> = {};
  for (const weevil of databaseWeevils) {
    weevilMap[weevil.name] = weevil;
  }
  const databaseWeevilNames = (await getWeevils()).map((weevil) => weevil.name);

  const fileWeevils = getFileNames(WEEVIL_PATH);

  const newFiles = fileWeevils.filter(
    (weevil) => !databaseWeevilNames.includes(weevil),
  );
  const deletedFiles = databaseWeevilNames.filter(
    (weevil) => !fileWeevils.includes(weevil),
  );

  if (newFiles.length > 0) {
    await insertWeevils(
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
    await deleteWeevils(deletedFiles);
    console.log(`${deletedFiles.length} old weevils deleted`);
  }
}

export async function checkDrive(
  driveEmbed: DriveEmbedManager,
): Promise<DriveResults> {
  // Get New Files in Google Drive
  const files = await listFiles(WEEVIL_DRIVE_FOLDER_ID);

  // Find any google drive files with the same name in the database
  const fileNames: string[] = files.map((file) => file.name);
  const existingWeevils = await getWeevilsByName(fileNames);
  const existingSet = new Set();
  for (const existing of existingWeevils) {
    existingSet.add(existing.name);
  }
  console.log(`${existingWeevils.length} duplicate name(s) found`);

  // Filter out those matches
  const newFiles = files.filter(
    (file) => file?.name && !existingSet.has(file?.name),
  );

  let driveItem: driveItem = {
    name: "Weevil",
    downloading: newFiles.length,
    downloaded: 0,
    duplicates: existingWeevils.length,
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
    new: newFiles.map((file) => file.name),
  };
}
