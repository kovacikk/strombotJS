import type { DiscordCron } from "../types.js";
import { AttachmentBuilder } from "discord.js";
import { getRandomItem } from "../data/data_controller";
import { Weevil } from "../data/entities/Weevil.js";
import { getGeneralChannel } from "../helpers";
import { readFileSync } from "node:fs";

const WeevilWednesday: DiscordCron = {
  name: "weevil_wednesday",
  pattern: "0 4 * * 3",
  execute: async (client) => {
    const channel = await getGeneralChannel(client);

    if (channel) {
      const weevil = await getRandomItem(Weevil);

      if (!weevil) {
        console.error(`Failed to load weevil`);
        return;
      }

      console.log(`Uploading weevil ${weevil.name}`);
      const fileBuffer = readFileSync(weevil?.path ?? "");
      const file = new AttachmentBuilder(fileBuffer, {
        name: weevil?.name ?? "",
      });

      await channel.send({
        files: [file],
      });
    }
  },
};

export default WeevilWednesday;
