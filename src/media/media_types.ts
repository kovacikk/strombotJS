export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export enum Category {
  Bulborb = "bulborb",
  Cat = "cat",
  Meme = "meme",
  DayMeme = "day_meme",
  Weevil = "weevil",
}

export function isCategoryType(category: string): category is Category {
  return Object.values(Category).includes(category as Category);
}

export enum DayCategory {
  Monday = "monday",
  Tuesday = "tuesday",
  Wednesday = "wednesday",
  Thursday = "thursday",
  Friday = "friday",
  Saturday = "saturday",
  Sunday = "sunday",
}

export function isDayCategoryType(category: string): category is DayCategory {
  return Object.values(DayCategory).includes(category as DayCategory);
}
