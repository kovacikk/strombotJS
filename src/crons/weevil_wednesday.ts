import type { DiscordCron } from "../types.js";
import { TextChannel, AttachmentBuilder } from "discord.js";
import { getWeevil } from "../data/data_controller";
import { getGeneralChannel } from "../helpers";

const WeevilWednesday: DiscordCron = {
  name: "weevil_wednesday",
  pattern: "0 4 * * 3",
  execute: async (client) => {
    const channel = await getGeneralChannel(client);

    if (channel) {
      const weevil = await getWeevil();

      if (!weevil) {
        console.error(`Failed to load weevil`);
        return;
      }

      const file = new AttachmentBuilder(weevil?.path ?? "", {
        name: weevil?.name ?? "",
      });

      await channel.send({
        files: [file],
      });
    }
  },
};

export default WeevilWednesday;
