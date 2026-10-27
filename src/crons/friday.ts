import type { DiscordCron } from "../types.js";
import { AttachmentBuilder } from "discord.js";
import { getRandomItem } from "../data/data_controller.js";
import { getGeneralChannel } from "../helpers";
import { Meme } from "../data/entities/Meme.js";
import { readFileSync } from "node:fs";

const Friday: DiscordCron = {
  name: "friday",
  pattern: "0 17 * * 5",
  execute: async (client) => {
    const channel = await getGeneralChannel(client);

    if (channel) {
      const meme = await getRandomItem(Meme);

      if (!meme) {
        console.error(`Failed to load meme`);
        return;
      }

      console.log(`Uploading meme ${meme.name}`);
      const fileBuffer = readFileSync(meme?.path ?? "");
      const file = new AttachmentBuilder(fileBuffer, {
        name: meme?.name ?? "",
      });

      await channel.send({
        content: `You all survived to the weekend! Here's a random meme to celebrate:`,
        files: [file],
      });
    }
  },
};

export default Friday;
