import type { DiscordCron } from "../types.js";
import { TextChannel, AttachmentBuilder } from "discord.js";
import { getWeevil } from "../data/data_controller.js";

//const BIGONE_CHANNEL_ID = process.env.BIGONE_CHANNEL_ID ?? "";
const TEST_CHANNEL_ID = process.env.TEST_CHANNEL_ID ?? "";

const WeevilWednesday: DiscordCron = {
  name: "weevil_wednesday",
  pattern: "0 4 * * 3",
  execute: async (client) => {
    let channel = (await client.channels.cache.get(
      TEST_CHANNEL_ID,
    )) as TextChannel;
    if (!channel) {
      channel = (await client.channels.fetch(TEST_CHANNEL_ID)) as TextChannel;
    }
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
