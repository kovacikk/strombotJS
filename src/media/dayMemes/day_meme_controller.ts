import {
  getDayMemes,
  insertDayMemes,
  deleteDayMemes,
} from "../../data/data_controller";
import { DayMeme } from "../../data/entities/DayMeme";
import { getFileNames } from "../media_controller";
import { listFiles, downloadAndEvictFiles } from "../../drive/drive_controller";
import { getDayMemesByName } from "../../data/data_controller";
import { DriveResults } from "../media_controller";
import {
  DriveEmbedManager,
  DriveItem,
  driveState,
} from "../../drive/drive_embed";
import { DayCategory } from "../media_types";
import { MAX_FILE_SIZE } from "../media_types";

export const dayDriveFolderIds: Record<DayCategory, string> = {
  [DayCategory.Monday]: "1ozl3MJU3cmXAJXfUjLK-mfbGvQJXnIfF",
  [DayCategory.Tuesday]: "1vhSqHe1tlx0vwnKQ9lKURHcGDrshogH6",
  [DayCategory.Wednesday]: "15YLBs3uIS0OYu8uKzjn59xg5XmAaLdfo",
  [DayCategory.Thursday]: "1Svd3hIVMRVE0VPZL9xamrCaxSMfjO56l",
  [DayCategory.Friday]: "1nX2MFzjt92QgjGx0xJITIMTAibooGPVy",
  [DayCategory.Saturday]: "1aofAFtvGYZynfeQ5DZdLxZsIqckjbNlv",
  [DayCategory.Sunday]: "1RHNDCCO8buq9Ml1XeBFMKbzg1ih3XGie",
};

export const dayMediaPaths: Record<DayCategory, string> = {
  [DayCategory.Monday]: "/app/media/day_memes/monday/",
  [DayCategory.Tuesday]: "/app/media/day_memes/tuesday/",
  [DayCategory.Wednesday]: "/app/media/day_memes/wednesday/",
  [DayCategory.Thursday]: "/app/media/day_memes/thursday/",
  [DayCategory.Friday]: "/app/media/day_memes/friday/",
  [DayCategory.Saturday]: "/app/media/day_memes/saturday/",
  [DayCategory.Sunday]: "/app/media/day_memes/sunday/",
};

// Compares files and database to insert new dayMemes and delete old ones
export async function sync(type: DayCategory): Promise<void> {
  const DAYMEME_PATH = dayMediaPaths[type];

  const databaseDayMemes = await getDayMemes(type);

  const dayMemeMap: Record<string, DayMeme> = {};
  for (const dayMeme of databaseDayMemes) {
    dayMemeMap[dayMeme.name] = dayMeme;
  }
  const databaseDayMemeNames = (await getDayMemes(type)).map(
    (dayMeme) => dayMeme.name,
  );

  const fileDayMemes = getFileNames(DAYMEME_PATH);

  const newFiles = fileDayMemes.filter(
    (dayMeme) => !databaseDayMemeNames.includes(dayMeme),
  );
  const deletedFiles = databaseDayMemeNames.filter(
    (dayMeme) => !fileDayMemes.includes(dayMeme),
  );

  if (newFiles.length > 0) {
    await insertDayMemes(
      newFiles.map((file) =>
        Object.assign(new DayMeme(), {
          name: file,
          type,
          path: `${DAYMEME_PATH}${file}`,
        }),
      ),
    );
    console.log(`${newFiles.length} new dayMemes inserted`);
  }

  if (deletedFiles.length > 0) {
    await deleteDayMemes(deletedFiles);
    console.log(`${deletedFiles.length} old dayMemes deleted`);
  }
}

export async function checkDrive(
  type: DayCategory,
  driveEmbed: DriveEmbedManager,
): Promise<DriveResults> {
  const DAYMEME_PATH = dayMediaPaths[type];
  const DAYMEME_DRIVE_FOLDER_ID = dayDriveFolderIds[type];

  // Get New Files in Google Drive
  const files = await listFiles(DAYMEME_DRIVE_FOLDER_ID);

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
  const existingDayMemes = await getDayMemesByName(fileNames);
  const existingSet = new Set();
  for (const existing of existingDayMemes) {
    existingSet.add(existing.name);
  }
  console.log(`${existingDayMemes.length} duplicate name(s) found`);

  // Filter out those matches
  const newFiles = files.filter(
    (file) =>
      file?.name &&
      !existingSet.has(file?.name) &&
      !existingSet.has(file?.name),
  );

  let driveItem: DriveItem = {
    name: `DayMeme - ${type}`,
    downloading: newFiles.length,
    downloaded: 0,
    duplicates: existingDayMemes.length,
    largeFiles: largeFiles.length,
  };
  driveEmbed.setState(driveState.Downloading).setCurrentItem(driveItem);

  // Download new and delete drive files
  await downloadAndEvictFiles(newFiles, DAYMEME_PATH, driveEmbed);
  console.log(`${newFiles.length} new file(s) downloaded`);

  await sync(type);

  // Don't complete item, because completed item is aggregated with other days
  if (newFiles.length > 0) {
    await driveEmbed.refresh();
  }

  return {
    name: `DayMemes - ${type}`,
    duplicates: existingDayMemes.flatMap((dayMeme) => dayMeme.name),
    largeFiles: largeFiles.flatMap((largFile) => largFile.name),
    new: newFiles.map((file) => file.name),
  };
}

export async function checkDriveAll(
  driveEmbed: DriveEmbedManager,
): Promise<DriveEmbedManager> {
  let totalNewFiles = 0;
  let totalDuplicates = 0;
  let totalLargeFiles = 0;

  for (const type of Object.values(DayCategory)) {
    const {
      duplicates,
      largeFiles,
      new: newFiles,
    } = await checkDrive(type, driveEmbed);

    totalNewFiles += newFiles.length;
    totalDuplicates += duplicates.length;
    totalLargeFiles += largeFiles.length;
  }

  let driveItem: DriveItem = {
    name: `DayMeme`,
    downloading: totalNewFiles,
    downloaded: totalNewFiles,
    duplicates: totalDuplicates,
    largeFiles: totalLargeFiles,
  };
  driveEmbed.setCurrentItem(driveItem);

  driveEmbed.completeCurrentItem();
  await driveEmbed.refresh();

  return driveEmbed;
}
