import DataSource from "../data_source";
import { In, MoreThan } from "typeorm";
import { Cat } from "./entities/Cat";
import { Meme } from "./entities/Meme";
import { Bulborb } from "./entities/Bulborb";
import { User } from "./entities/User";
import { UserCommandStats } from "./entities/UserCommandStats";

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
