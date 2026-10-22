import type { DiscordCron } from "../types.js";
import { TextChannel, AttachmentBuilder } from "discord.js";

//const BIGONE_CHANNEL_ID = process.env.BIGONE_CHANNEL_ID ?? "";
const TEST_CHANNEL_ID = process.env.TEST_CHANNEL_ID ?? "";

const ANCHOR_DATE = new Date("2020-01-07T00:00:00");
const MS_IN_A_WEEK = 1000 * 60 * 60 * 24 * 7;

const REGINALD_PATH = "/app/media/events/reginald/reginald.jpg";

const Reginald: DiscordCron = {
  name: "reginald",
  pattern: "0 12 * * 2",
  execute: async (client) => {
    const now = new Date();

    const weeksSinceAnchor = Math.floor(
      (now.getTime() - ANCHOR_DATE.getTime()) / MS_IN_A_WEEK,
    );
    if (weeksSinceAnchor % 2 === 0) {
      console.log("Skipping reginald since this is an off week");
      return;
    }

    let channel = (await client.channels.cache.get(
      TEST_CHANNEL_ID,
    )) as TextChannel;
    if (!channel) {
      channel = (await client.channels.fetch(TEST_CHANNEL_ID)) as TextChannel;
    }
    if (channel) {
      const file = new AttachmentBuilder(REGINALD_PATH, {
        name: "reginald.jpg",
      });

      await channel.send({
        files: [file],
      });
    }
  },
};

export default Reginald;
