import type { DiscordCommand } from "../types.js";
import { AttachmentBuilder } from "discord.js";

const GOODNIGHT_PATH = "/app/media/events/goodnight/goodnight.mp4";

const Goodnight: DiscordCommand = {
  name: "goodnight",
  description: "Post goodnight video",
  log: true,
  execute: async (interaction) => {
    await interaction.deferReply();

    const file = new AttachmentBuilder(GOODNIGHT_PATH, {
      name: "goodnight.mp4",
    });

    await interaction.editReply({
      files: [file],
    });
  },
};

export default Goodnight;
