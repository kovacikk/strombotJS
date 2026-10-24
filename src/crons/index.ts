import type { DiscordCron } from "../types.js";
import WeevilWednesday from "./weevil_wednesday.js";
import Reginald from "./reginald.js";
import ReginaldBread from "./reginald_bread.js";
import Birthday from "./birthday.js";
import SpecialDates from "./special_dates.js";
import Friday from "./friday.js";

const allCrons: DiscordCron[] = [
  Birthday,
  WeevilWednesday,
  Reginald,
  ReginaldBread,
  SpecialDates,
  Friday,
];

export default allCrons;
