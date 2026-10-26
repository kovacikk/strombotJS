import DataSource from "./migration_source";
import * as fs from "fs";
import csv from "csv-parser";
import { User } from "../src/data/entities/User";
import { Bulborb } from "../src/data/entities/Bulborb";
import { Cat } from "../src/data/entities/Cat";
import { Meme } from "../src/data/entities/Meme";
import { UserCommandStats } from "../src/data/entities/UserCommandStats";
import { exit } from "process";

(async () => {
  await DataSource.initialize();

  await migrateBirthdays();
  await migrateUserData();
  await migrateCancelData();

  await migrateBulborbData();
  await migrateCatData();
  await migrateMemeData();

  exit();
})();

interface Birthday {
  firstName: string;
  lastName: string;
  month: string;
  day: string;
  id: string;
}
async function migrateBirthdays() {
  const BIRTHDAY_PATH = "./csv/birthdays.csv";

  const birthdays: Birthday[] = await readCsvFile(BIRTHDAY_PATH);

  const newUsers = [];
  for (const birthday of birthdays) {
    const user = new User();
    user.id = birthday.id;
    user.firstName = birthday.firstName;
    user.lastName = birthday.lastName;
    user.birthMonth = Number(birthday.month);
    user.birthDay = Number(birthday.day);

    newUsers.push(user);
  }

  await saveUsers(newUsers);
  console.log("Birthdays Saved");
}

export interface UserData {
  averagerate: string;
  bonk: string;
  bulborb: string;
  cancel: string;
  cat: string;
  coin: string;
  cringe: string;
  dailymeme: string;
  dark: string;
  fail: string;
  goodnight: string;
  id: string;
  kek: string;
  meme: string;
  patch: string;
  playing: string;
  playlist: string;
  playlistmeme: string;
  ratememe: string;
  ratepost: string;
  skip: string;
  song: string;
  songmeme: string;
  stat: string;
  stop: string;
  sumrate: string;
  total: string;
  update: string;
  yes: string;
}
async function migrateUserData() {
  const USER_DATA_PATH = "./csv/userData.csv";

  const userData: UserData[] = await readCsvFile(USER_DATA_PATH);

  const commandStats: UserCommandStats[] = [];
  for (const data of userData) {
    let user = new User();
    user.id = data.id;

    user = (await saveUsers([user]))[0];

    const commandStat = new UserCommandStats();
    commandStat.user = user;
    commandStat.cat = Number(data.cat);

    commandStat.cancel = Number(data.cancel);
    commandStat.meme = Number(data.meme);
    commandStat.bulborb = Number(data.bulborb);
    commandStat.daymeme = Number(data.dailymeme);
    commandStat.goodnight = Number(data.goodnight);
    commandStat.stat = Number(data.stat);

    commandStats.push(commandStat);
  }

  await saveUserCommandStats(commandStats);

  console.log("User Data Saved");
}

interface CancelData {
  id: string;
  count: string;
}
async function migrateCancelData() {
  const CANCEL_DATA_PATH = "./csv/cancelData.csv";

  const cancels: CancelData[] = await readCsvFile(CANCEL_DATA_PATH);

  const newUsers = [];
  for (const cancel of cancels) {
    const user = new User();
    user.id = cancel.id;
    user.cancels = Number(cancel.count);

    newUsers.push(user);
  }

  await saveUsers(newUsers);
  console.log("Cancels Saved");
}

// Misc Migrations
interface BulborbData {
  bulborb: string;
  count: string;
}
async function migrateBulborbData() {
  const BULBORB_DATA_PATH = "./csv/bulborbData.csv";

  const bulborbs: BulborbData[] = await readCsvFile(BULBORB_DATA_PATH);

  const newBulborbs = [];
  for (const bulborb of bulborbs) {
    const newBulborb = new Bulborb();
    newBulborb.name = bulborb.bulborb;
    newBulborb.path = `/app/media/bulborbs/${bulborb.bulborb}`;
    newBulborb.uses = Number(bulborb.count);

    newBulborbs.push(newBulborb);
  }

  await saveBulborbs(newBulborbs);
  console.log("Bulborbs Saved");
}

interface CatData {
  cat: string;
  count: string;
}
async function migrateCatData() {
  const CAT_DATA_PATH = "./csv/catData.csv";

  const cats: CatData[] = await readCsvFile(CAT_DATA_PATH);

  const newCats = [];
  for (const cat of cats) {
    const newCat = new Cat();
    newCat.name = cat.cat;
    newCat.path = `/app/media/cats/${cat.cat}`;
    newCat.uses = Number(cat.count);

    newCats.push(newCat);
  }

  await saveCats(newCats);
  console.log("Cats Saved");
}

interface MemeData {
  meme: string;
  count: string;
}
async function migrateMemeData() {
  const MEME_DATA_PATH = "./csv/memeData.csv";

  const memes: MemeData[] = await readCsvFile(MEME_DATA_PATH);

  const newMemes = [];
  for (const meme of memes) {
    const newMeme = new Meme();
    newMeme.name = meme.meme;
    newMeme.path = `/app/media/memes/${meme.meme}`;
    newMeme.uses = Number(meme.count);

    newMemes.push(newMeme);
  }

  await saveMemes(newMemes);
  console.log("Memes Saved");
}

function readCsvFile(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: any) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

async function saveUsers(users: User[]): Promise<User[]> {
  const userRepository = DataSource.getRepository(User);
  const savedUsers = await userRepository.save(users);

  return savedUsers;
}

async function saveUserCommandStats(
  commandStats: UserCommandStats[],
): Promise<UserCommandStats[]> {
  const userCommandStatsRepository = DataSource.getRepository(UserCommandStats);
  const savedUserCommandStats =
    await userCommandStatsRepository.save(commandStats);

  return savedUserCommandStats;
}

async function saveBulborbs(bulborbs: Bulborb[]): Promise<Bulborb[]> {
  const bulborbRepository = DataSource.getRepository(Bulborb);
  const savedBulborbs = await bulborbRepository.save(bulborbs);

  return savedBulborbs;
}

async function saveCats(cats: Cat[]): Promise<Cat[]> {
  const catRepository = DataSource.getRepository(Cat);
  const savedCats = await catRepository.save(cats);

  return savedCats;
}

async function saveMemes(memes: Meme[]): Promise<Meme[]> {
  const memeRepository = DataSource.getRepository(Meme);
  const savedMemes = await memeRepository.save(memes);

  return savedMemes;
}
