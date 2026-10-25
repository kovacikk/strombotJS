import DataSource from "../data_source";
import {
  In,
  MoreThan,
  EntityTarget,
  ObjectLiteral,
  Repository,
  Brackets,
} from "typeorm";
import { Cat } from "./entities/Cat";
import { Meme } from "./entities/Meme";
import { Bulborb } from "./entities/Bulborb";
import { User } from "./entities/User";
import { UserCommandStats } from "./entities/UserCommandStats";
import { Weevil } from "./entities/Weevil";
import { DayMeme } from "./entities/DayMeme";
import { DayCategory } from "../media/media_types";
import { SpecialDate } from "./entities/SpecialDate";
import { SelectQueryBuilder } from "typeorm/browser";

type Where = { condition: string; parameters?: ObjectLiteral };

type GetOptions = {
  contains?: string;
  recent?: boolean;
  andWheres?: Where[];
};

async function applyFilters<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  repository: Repository<T>,
  alias: string,
  options?: GetOptions,
): Promise<SelectQueryBuilder<T> | null> {
  const { contains, recent, andWheres } = options ?? {};

  const wheres: Where[] = [];

  if (recent) {
    const latestItem = await repository
      .createQueryBuilder(alias)
      .select(`MAX(${alias}.createdAt)`, "maxDate")
      .getRawOne();

    const maxDateStr = latestItem?.maxDate;
    if (!maxDateStr) return null;

    const maxDate = new Date(maxDateStr);
    const oneDayBefore = new Date(maxDate.getTime() - 24 * 60 * 60 * 1000);

    wheres.push({
      condition: `${alias}.createdAt >= :oneDayBefore`,
      parameters: { oneDayBefore },
    });
    wheres.push({
      condition: `${alias}.createdAt <= :maxDate`,
      parameters: { maxDate: new Date(maxDate.getTime() + 1) },
    });
  }

  if (contains) {
    wheres.push({
      condition: `${alias}.name LIKE :name`,
      parameters: { name: `%${contains}%` },
    });
  }

  if (andWheres) {
    for (const where of andWheres) {
      wheres.push(where);
    }
  }

  let first = true;
  for (const { condition, parameters } of wheres) {
    if (first) {
      query = query.where(condition, parameters);
      first = false;
    } else {
      query = query.andWhere(condition, parameters);
    }
  }
  return query;
}

// Get Random Item
export async function getRandomItem<T extends ObjectLiteral>(
  entityTarget: EntityTarget<T>,
  options?: GetOptions,
): Promise<T | null> {
  const repository = DataSource.getRepository(entityTarget);
  const alias = repository.metadata.name.toLowerCase();
  let query = repository.createQueryBuilder(alias);

  const filteredQuery = await applyFilters(query, repository, alias, options);
  if (!filteredQuery) return null;

  query = filteredQuery.orderBy("RAND()");

  return await query.getOne();
}

// Get Items
export async function getItems<T extends ObjectLiteral>(
  entityTarget: EntityTarget<T>,
  options?: GetOptions,
): Promise<T[]> {
  const repository = DataSource.getRepository(entityTarget);
  const alias = repository.metadata.name.toLowerCase();
  let query = repository.createQueryBuilder(alias);

  const filteredQuery = await applyFilters(query, repository, alias, options);
  if (!filteredQuery) return [];

  query = filteredQuery.orderBy(`${alias}.name`);

  return await query.getMany();
}

// Get Items by Field
export async function getItemsByField<T extends ObjectLiteral>(
  entityTarget: EntityTarget<T>,
  values: any[],
  column: keyof T,
): Promise<T[]> {
  const repository = DataSource.getRepository(entityTarget);

  return await repository.find({
    where: {
      [column]: In(values),
    } as any,
  });
}

// Insert Items
export async function insertItems<T extends ObjectLiteral>(
  entityTarget: EntityTarget<T>,
  items: T[],
): Promise<void> {
  const repository = DataSource.getRepository(entityTarget);

  await repository.save(items);
}

// Delete Items By Field
export async function deleteItemsByField<T extends ObjectLiteral>(
  entityTarget: EntityTarget<T>,
  values: any[],
  column: keyof T,
): Promise<void> {
  const repository = DataSource.getRepository(entityTarget);

  await repository.delete({
    [column]: In(values),
  } as any);
}

// Day Meme Stuff
export async function getRandomDayMeme(
  type: DayCategory,
  options: GetOptions = {},
): Promise<DayMeme | null> {
  const newOptions: GetOptions = {
    ...options,
    andWheres: [
      ...(options.andWheres || []),
      {
        condition: "daymeme.type = :type",
        parameters: { type },
      },
    ],
  };

  return await getRandomItem(DayMeme, newOptions);
}

export async function getDayMemes(
  type: DayCategory,
  options: GetOptions = {},
): Promise<DayMeme[]> {
  const newOptions: GetOptions = {
    ...options,
    andWheres: [
      ...(options.andWheres || []),
      {
        condition: "daymeme.type = :type",
        parameters: { type },
      },
    ],
  };
  return await getItems(DayMeme, newOptions);
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

export async function getDevotion(): Promise<User[]> {
  const userRepository = DataSource.getRepository(User);

  const users = userRepository.find({
    where: {
      devotion: MoreThan(0),
    },
    order: {
      cancels: "DESC",
    },
  });

  return users;
}

export async function incrementDevotion(
  user: User,
  amount: number,
  setLastPrayer: boolean = true,
): Promise<void> {
  const userRepository = DataSource.getRepository(User);

  const updatePayload: any = {
    devotion: () => "devotion + :amount",
  };

  if (setLastPrayer) {
    updatePayload.lastPrayer = new Date();
  }

  await userRepository
    .createQueryBuilder()
    .update(User)
    .set(updatePayload)
    .where("id = :id")
    .setParameters({
      id: user.id,
      amount: amount,
    })
    .execute();
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
