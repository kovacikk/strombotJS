import type { DiscordCron } from "../types.js";
import WeevilWednesday from "./weevil_wednesday.js";
import Reginald from "./reginald.js";
import ReginaldBread from "./reginald_bread.js";
import Birthday from "./birthday.js";
import SpecialDates from "./special_dates.js";

const allCrons: DiscordCron[] = [
  Birthday,
  WeevilWednesday,
  Reginald,
  ReginaldBread,
  SpecialDates,
];

export default allCrons;
