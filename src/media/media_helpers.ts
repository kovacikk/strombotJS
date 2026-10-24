import { Category } from "./media_types";
import { BULBORB_PATH } from "../media/bulborbs/bulborb_controller";
import { CAT_PATH } from "../media/cats/cat_controller";
import { MEME_PATH } from "../media/memes/meme_controller";
import { WEEVIL_PATH } from "../media/weevils/weevil_controller";

export const categoryPathMap: Partial<Record<Category, string>> = {
  [Category.Bulborb]: BULBORB_PATH,
  [Category.Cat]: CAT_PATH,
  [Category.Meme]: MEME_PATH,
  [Category.Weevil]: WEEVIL_PATH,
};
