import DataSource from "../data_source";
import { In, MoreThan, Raw } from "typeorm";
import { Cat } from "./entities/Cat";
import { Meme } from "./entities/Meme";
import { Bulborb } from "./entities/Bulborb";
import { User } from "./entities/User";
import { UserCommandStats } from "./entities/UserCommandStats";
import { Weevil } from "./entities/Weevil";
import { DayMeme } from "./entities/DayMeme";
import { DayCategory } from "../media/media_types";
import { SpecialDate } from "./entities/SpecialDate";

type GetOptions = {
  contains?: string;
};

// Bulborb Stuff
export async function getBulborb(
  options?: GetOptions,
): Promise<Bulborb | null> {
  const { contains } = options ?? {};

  const bulborbRepository = DataSource.getRepository(Bulborb);

  let query = bulborbRepository.createQueryBuilder("bulborb");

  if (contains) {
    query = query.where("bulborb.name LIKE :name", { name: `%${contains}%` });
  }
  query = query.orderBy("RAND()");

  const bulborb = await query.getOne();
  return bulborb;
}

export async function getBulborbs(options?: GetOptions): Promise<Bulborb[]> {
  const { contains } = options ?? {};

  const bulborbRepository = DataSource.getRepository(Bulborb);

  let query = bulborbRepository.createQueryBuilder("bulborb");

  if (contains) {
    query = query.where("bulborb.name LIKE :name", { name: `%${contains}%` });
  }
  query = query.orderBy("bulborb.name");

  const bulborbs = await query.getMany();
  return bulborbs;
}

export async function getBulborbsByName(names: string[]): Promise<Bulborb[]> {
  const bulborbRepository = DataSource.getRepository(Bulborb);

  const bulborbs: Bulborb[] = await bulborbRepository.find({
    where: {
      name: In(names),
    },
  });

  return bulborbs;
}

export async function insertBulborbs(bulborbs: Bulborb[]): Promise<void> {
  const bulborbRepository = DataSource.getRepository(Bulborb);

  await bulborbRepository.save(bulborbs);
}

export async function deleteBulborbs(bulborbs: string[]): Promise<void> {
  const bulborbRepository = DataSource.getRepository(Bulborb);

  await bulborbRepository.delete({
    name: In(bulborbs),
  });
}

// Cat Stuff
export async function getCat(options?: GetOptions): Promise<Cat | null> {
  const { contains } = options ?? {};

  const catRepository = DataSource.getRepository(Cat);

  let query = catRepository.createQueryBuilder("cat");

  if (contains) {
    query = query.where("cat.name LIKE :name", { name: `%${contains}%` });
  }
  query = query.orderBy("RAND()");

  const cat = await query.getOne();
  return cat;
}

export async function getCats(options?: GetOptions): Promise<Cat[]> {
  const { contains } = options ?? {};

  const catRepository = DataSource.getRepository(Cat);

  let query = catRepository.createQueryBuilder("cat");

  if (contains) {
    query = query.where("cat.name LIKE :name", { name: `%${contains}%` });
  }
  query = query.orderBy("cat.name");

  const cats = await query.getMany();
  return cats;
}

export async function getCatsByName(names: string[]): Promise<Cat[]> {
  const catRepository = DataSource.getRepository(Cat);

  const cats: Cat[] = await catRepository.find({
    where: {
      name: In(names),
    },
  });

  return cats;
}

export async function insertCats(cats: Cat[]): Promise<void> {
  const catRepository = DataSource.getRepository(Cat);

  await catRepository.save(cats);
}

export async function deleteCats(cats: string[]): Promise<void> {
  const catRepository = DataSource.getRepository(Cat);

  await catRepository.delete({
    name: In(cats),
  });
}

// Meme Stuff
export async function getMeme(options?: GetOptions): Promise<Meme | null> {
  const { contains } = options ?? {};

  const memeRepository = DataSource.getRepository(Meme);

  let query = memeRepository.createQueryBuilder("meme");

  if (contains) {
    query = query.where("meme.name LIKE :name", { name: `%${contains}%` });
  }
  query = query.orderBy("RAND()");

  const meme = await query.getOne();
  return meme;
}

export async function getMemes(options?: GetOptions): Promise<Meme[]> {
  const { contains } = options ?? {};

  const memeRepository = DataSource.getRepository(Meme);

  let query = memeRepository.createQueryBuilder("meme");

  if (contains) {
    query = query.where("meme.name LIKE :name", { name: `%${contains}%` });
  }
  query = query.orderBy("meme.name");

  const memes = await query.getMany();
  return memes;
}

export async function getMemesByName(names: string[]): Promise<Meme[]> {
  const memeRepository = DataSource.getRepository(Meme);

  const memes: Meme[] = await memeRepository.find({
    where: {
      name: In(names),
    },
  });

  return memes;
}

export async function insertMemes(memes: Meme[]): Promise<void> {
  const memeRepository = DataSource.getRepository(Meme);

  await memeRepository.save(memes);
}

export async function deleteMemes(memes: string[]): Promise<void> {
  const memeRepository = DataSource.getRepository(Meme);

  await memeRepository.delete({
    name: In(memes),
  });
}

// Weevil Stuff
export async function getWeevil(options?: GetOptions): Promise<Weevil | null> {
  const { contains } = options ?? {};

  const weevilRepository = DataSource.getRepository(Weevil);

  let query = weevilRepository.createQueryBuilder("weevil");

  if (contains) {
    query = query.where("weevil.name LIKE :name", { name: `%${contains}%` });
  }
  query = query.orderBy("RAND()");

  const weevil = await query.getOne();
  return weevil;
}

export async function getWeevils(options?: GetOptions): Promise<Weevil[]> {
  const { contains } = options ?? {};

  const weevilRepository = DataSource.getRepository(Weevil);

  let query = weevilRepository.createQueryBuilder("weevil");

  if (contains) {
    query = query.where("weevil.name LIKE :name", { name: `%${contains}%` });
  }
  query = query.orderBy("weevil.name");

  const weevils = await query.getMany();
  return weevils;
}

export async function getWeevilsByName(names: string[]): Promise<Weevil[]> {
  const weevilRepository = DataSource.getRepository(Weevil);

  const weevils: Weevil[] = await weevilRepository.find({
    where: {
      name: In(names),
    },
  });

  return weevils;
}

export async function insertWeevils(weevils: Weevil[]): Promise<void> {
  const weevilRepository = DataSource.getRepository(Weevil);

  await weevilRepository.save(weevils);
}

export async function deleteWeevils(weevils: string[]): Promise<void> {
  const weevilRepository = DataSource.getRepository(Weevil);

  await weevilRepository.delete({
    name: In(weevils),
  });
}

// Day Meme Stuff
export async function getDayMeme(
  type: DayCategory,
  options?: GetOptions,
): Promise<DayMeme | null> {
  const { contains } = options ?? {};

  const dayMemeRepository = DataSource.getRepository(DayMeme);

  let query = dayMemeRepository.createQueryBuilder("dayMeme");

  if (contains) {
    query = query.where("dayMeme.name LIKE :name", { name: `%${contains}%` });
  }
  query = query.andWhere("dayMeme.type = :type", { type }).orderBy("RAND()");

  const dayMeme = await query.getOne();
  return dayMeme;
}

export async function getDayMemes(
  type: DayCategory,
  options?: GetOptions,
): Promise<DayMeme[]> {
  const { contains } = options ?? {};

  const dayMemeRepository = DataSource.getRepository(DayMeme);

  let query = dayMemeRepository.createQueryBuilder("dayMeme");

  if (contains) {
    query = query.where("dayMeme.name LIKE :name", { name: `%${contains}%` });
  }
  query = query
    .andWhere("dayMeme.type = :type", { type })
    .orderBy("dayMeme.name");

  const dayMemes = await query.getMany();
  return dayMemes;
}

export async function getDayMemesByName(names: string[]): Promise<DayMeme[]> {
  const dayMemeRepository = DataSource.getRepository(DayMeme);

  const dayMemes: DayMeme[] = await dayMemeRepository.find({
    where: {
      name: In(names),
    },
  });

  return dayMemes;
}

export async function insertDayMemes(dayMemes: DayMeme[]): Promise<void> {
  const dayMemeRepository = DataSource.getRepository(DayMeme);

  await dayMemeRepository.save(dayMemes);
}

export async function deleteDayMemes(dayMemes: string[]): Promise<void> {
  const dayMemeRepository = DataSource.getRepository(DayMeme);

  await dayMemeRepository.delete({
    name: In(dayMemes),
  });
}

// User stuff
export async function getOrCreateUser(userId: string): Promise<User> {
  let userEntry = await getUser(userId);

  // Add user to user database if not present
  if (!userEntry) {
    const userPayload = {
      id: userId,
      stats: {},
    } as User;

    userEntry = await createUser(userPayload);
  }

  return userEntry;
}

export async function getUser(userId: string): Promise<User | null> {
  const userRepository = DataSource.getRepository(User);

  const user = await userRepository.findOne({
    where: {
      id: userId,
    },
    relations: {
      stats: true,
    },
  });

  return user;
}

async function createUser(user: User): Promise<User> {
  const userRepository = DataSource.getRepository(User);

  const newUser = userRepository.create(user);
  const savedUser = await userRepository.save(newUser);

  return savedUser;
}

export async function incrementCommandStat(
  user: User,
  stat: string,
): Promise<void> {
  const userCommandStatsRepository = DataSource.getRepository(UserCommandStats);

  await userCommandStatsRepository.increment({ user }, stat, 1);
}

export async function incrementCancel(
  user: User,
  amount: number,
): Promise<void> {
  const userRepository = DataSource.getRepository(User);

  await userRepository.increment({ id: user.id }, "cancels", amount);
}

export async function getCancels(): Promise<User[]> {
  const userRepository = DataSource.getRepository(User);

  const users = userRepository.find({
    where: {
      cancels: MoreThan(0),
    },
    order: {
      cancels: "DESC",
    },
  });

  return users;
}

export async function getBirthdays(birthday: Date): Promise<User[]> {
  const userRepository = DataSource.getRepository(User);

  const day = Number(
    new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      day: "numeric",
    }),
  );
  const month = Number(
    new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "numeric",
    }),
  );

  const user = userRepository.find({
    where: {
      birthDay: day,
      birthMonth: month,
    },
  });

  return user;
}

// Special Dates
export async function getSpecialDatesByDate(
  today: Date,
): Promise<SpecialDate[]> {
  const specialDateRepository = DataSource.getRepository(SpecialDate);

  const day = Number(
    new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      day: "numeric",
    }),
  );
  const month = Number(
    new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "numeric",
    }),
  );

  const dates = specialDateRepository.find({
    where: {
      day,
      month,
    },
  });

  return dates;
}

export async function getSpecialDates(
  options?: GetOptions,
): Promise<SpecialDate[]> {
  const { contains } = options ?? {};

  const specialDateRepository = DataSource.getRepository(SpecialDate);

  let query = specialDateRepository.createQueryBuilder("special_date");

  if (contains) {
    query = query.where("special_date.name LIKE :name", {
      name: `%${contains}%`,
    });
  }
  query = query.orderBy("special_date.name");

  const specialDates = await query.getMany();
  return specialDates;
}

export async function insertSpecialDates(
  specialDates: SpecialDate[],
): Promise<void> {
  const specialDateRepository = DataSource.getRepository(SpecialDate);

  await specialDateRepository.save(specialDates);
}

export async function deleteSpecialDates(
  specialDates: string[],
): Promise<void> {
  const specialDateRepository = DataSource.getRepository(SpecialDate);

  await specialDateRepository.delete({
    name: In(specialDates),
  });
}
