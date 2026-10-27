import type { DiscordCommand } from "../types.js";
import { AttachmentBuilder } from "discord.js";
import { readFileSync } from "node:fs";

const GOODNIGHT_PATH = "/app/media/events/goodnight/goodnight.mp4";

const Goodnight: DiscordCommand = {
  name: "goodnight",
  description: "Post goodnight video",
  log: true,
  execute: async (interaction) => {
    await interaction.deferReply();

    const fileBuffer = readFileSync(GOODNIGHT_PATH);
    const file = new AttachmentBuilder(fileBuffer, {
      name: "goodnight.mp4",
    });

    await interaction.editReply({
      files: [file],
    });
  },
};

export default Goodnight;
