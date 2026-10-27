import { getSpecialDatesByDate } from "../data/data_controller";
import type { DiscordCron } from "../types.js";
import {
  TextChannel,
  AttachmentBuilder,
  EmbedBuilder,
  MessagePayload,
  MessageCreateOptions,
} from "discord.js";
import { getGeneralChannel } from "../helpers";
import { readFileSync } from "node:fs";

const SpecialDates: DiscordCron = {
  name: "special_dates",
  pattern: "0 12 * * *",
  execute: async (client) => {
    const channel = await getGeneralChannel(client);

    if (channel) {
      const date = new Date();

      const dates = await getSpecialDatesByDate(date);

      for (const date of dates) {
        console.log(`Posting special date ${date.name}`);

        const fileBuffer = readFileSync(date?.path ?? "");
        const file = new AttachmentBuilder(fileBuffer, {
          name: date.name,
        });

        const message: MessageCreateOptions = {
          files: [file],
        };

        if (date.message) {
          message.content = date.message;
        }

        await channel.send(message);
      }
    }
  },
};

export default SpecialDates;
