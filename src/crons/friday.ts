import type { DiscordCron } from "../types.js";
import { TextChannel, AttachmentBuilder } from "discord.js";
import { getMeme } from "../data/data_controller.js";
import { getGeneralChannel } from "../helpers";

const Friday: DiscordCron = {
  name: "friday",
  pattern: "0 17 * * 5",
  execute: async (client) => {
    const channel = await getGeneralChannel(client);

    if (channel) {
      const meme = await getMeme();

      if (!meme) {
        console.error(`Failed to load meme`);
        return;
      }

      const file = new AttachmentBuilder(meme?.path ?? "", {
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
