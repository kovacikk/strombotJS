import * as fs from "fs";
import { sync as dayMemeSync } from "./dayMemes/day_meme_controller";
import { sync as weevilSync } from "./weevils/weevil_controller";
import { sync as bulborbSync } from "./bulborbs/bulborb_controller";
import { sync as catSync } from "./cats/cat_controller";
import { sync as memeSync } from "./memes/meme_controller";
import { Category, DayCategory } from "./media_types";

export const syncMap: Partial<Record<Category | DayCategory, () => void>> = {
  [Category.Bulborb]: bulborbSync,
  [Category.Cat]: catSync,
  [Category.Meme]: memeSync,
  [Category.Weevil]: weevilSync,
  [DayCategory.Monday]: () => {
    dayMemeSync(DayCategory.Monday);
  },
  [DayCategory.Tuesday]: () => {
    dayMemeSync(DayCategory.Tuesday);
  },
  [DayCategory.Wednesday]: () => {
    dayMemeSync(DayCategory.Wednesday);
  },
  [DayCategory.Thursday]: () => {
    dayMemeSync(DayCategory.Thursday);
  },
  [DayCategory.Friday]: () => {
    dayMemeSync(DayCategory.Friday);
  },
  [DayCategory.Saturday]: () => {
    dayMemeSync(DayCategory.Saturday);
  },
  [DayCategory.Sunday]: () => {
    dayMemeSync(DayCategory.Sunday);
  },
};

export type DriveResults = {
  name: string;
  duplicates: string[];
  largeFiles: string[];
  new: string[];
};

export function getFileNames(path: string): string[] {
  return fs
    .readdirSync(path, { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name);
}

export function deleteFiles(paths: string[]): Number {
  let deleted = 0;
  for (const path of paths) {
    try {
      if (fs.existsSync(path)) {
        fs.rmSync(path);
        deleted++;
      } else {
        console.log(`${path} not found`);
      }
    } catch (error) {
      throw new Error(`Failed to delete ${path}`);
    }
  }
  return deleted;
}

export async function sync(category: Category | DayCategory) {
  const syncFunc = syncMap[category];

  if (!syncFunc) {
    throw new Error(`No sync function found for category ${category}`);
  }

  await syncFunc();
}
