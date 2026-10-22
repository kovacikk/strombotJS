import type { DiscordCron } from "../types.js";
import WeevilWednesday from "./weevil_wednesday.js";
import Reginald from "./reginald.js";
import ReginaldBread from "./reginald_bread.js";

const allCrons: DiscordCron[] = [WeevilWednesday, Reginald, ReginaldBread];

export default allCrons;
