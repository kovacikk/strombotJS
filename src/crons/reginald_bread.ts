import type { DiscordCron } from "../types.js";
import { TextChannel, AttachmentBuilder } from "discord.js";

//const BIGONE_CHANNEL_ID = process.env.BIGONE_CHANNEL_ID ?? "";
const TEST_CHANNEL_ID = process.env.TEST_CHANNEL_ID ?? "";

const ANCHOR_DATE = new Date("2020-01-07T00:00:00");
const MS_IN_A_WEEK = 1000 * 60 * 60 * 24 * 7;

const REGINALD_BREAD_PATH = "/app/media/events/reginald/reginaldBread.jpg";

const ReginaldBread: DiscordCron = {
  name: "reginald_bread",
  pattern: "0 12 * * 3",
  execute: async (client) => {
    const now = new Date();

    const weeksSinceAnchor = Math.floor(
      (now.getTime() - ANCHOR_DATE.getTime()) / MS_IN_A_WEEK,
    );
    if (weeksSinceAnchor % 2 === 0) {
      console.log("Skipping reginald since this is an off week");
      return;
    }

    // 30% chance for garlic bread trigger
    if (Math.random() < 0.3) {
      let channel = (await client.channels.cache.get(
        TEST_CHANNEL_ID,
      )) as TextChannel;
      if (!channel) {
        channel = (await client.channels.fetch(TEST_CHANNEL_ID)) as TextChannel;
      }
      if (channel) {
        const file = new AttachmentBuilder(REGINALD_BREAD_PATH, {
          name: "reginaldBread.jpg",
        });

        await channel.send({
          files: [file],
        });
      }
    } else {
      console.log("Reginald did not forget his garlic bread this week");
    }
  },
};

export default ReginaldBread;
