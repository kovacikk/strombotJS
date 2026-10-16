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

export async function getCats(): Promise<Cat[]> {
  const catsRepository = DataSource.getRepository(Cat);

  const allCats: Cat[] = await catsRepository.find();

  return allCats;
}

export async function getMemes(): Promise<Meme[]> {
  const memeRepository = DataSource.getRepository(Meme);

  const allMemes: Meme[] = await memeRepository.find();

  return allMemes;
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
