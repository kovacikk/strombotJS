import DataSource from "../data_source";
import { In } from "typeorm";
import { Cat } from "./entities/Cat";
import { Meme } from "./entities/Meme";
import { Bulborb } from "./entities/Bulborb";

export async function getBulborbs(): Promise<Bulborb[]> {
  const bulborbRepository = DataSource.getRepository(Bulborb);

  const allBulborbs: Bulborb[] = await bulborbRepository.find();

  return allBulborbs;
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
