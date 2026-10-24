import { Category } from "../media/media_types";
import {
  getBulborbsByName,
  getCatsByName,
  getMemesByName,
  getWeevilsByName,
  getDayMemesByName,
} from "../data/data_controller";

export const categoryFunctionMap: Record<Category, (names: string[]) => any> = {
  [Category.Bulborb]: getBulborbsByName,
  [Category.Cat]: getCatsByName,
  [Category.Meme]: getMemesByName,
  [Category.DayMeme]: getDayMemesByName,
  [Category.Weevil]: getWeevilsByName,
};
