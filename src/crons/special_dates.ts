import { getSpecialDatesByDate } from "../data/data_controller";
import type { DiscordCron } from "../types.js";
import { TextChannel, AttachmentBuilder, EmbedBuilder } from "discord.js";

//const BIGONE_CHANNEL_ID = process.env.BIGONE_CHANNEL_ID ?? "";
const TEST_CHANNEL_ID = process.env.TEST_CHANNEL_ID ?? "";

const SpecialDates: DiscordCron = {
  name: "special_dates",
  pattern: "0 12 * * *",
  execute: async (client) => {
    let channel = (await client.channels.cache.get(
      TEST_CHANNEL_ID,
    )) as TextChannel;
    if (!channel) {
      channel = (await client.channels.fetch(TEST_CHANNEL_ID)) as TextChannel;
    }
    if (channel) {
      const date = new Date();

      const dates = await getSpecialDatesByDate(date);

      for (const date of dates) {
        console.log(`Posting special date ${date.name}`);

        const file = new AttachmentBuilder(date.path, {
          name: date.name,
        });

        await channel.send({
          files: [file],
        });
      }
    }
  },
};

export default SpecialDates;
