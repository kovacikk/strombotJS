import type { DiscordCommand } from "../types.js";
import { checkDrive as checkDriveBulborb } from "../media/bulborbs/bulborb_controller.js";
import { checkDrive as checkDriveCat } from "../media/cats/cat_controller.js";
import { checkDrive as checkDriveMeme } from "../media/memes/meme_controller.js";
import { DriveEmbedManager, driveState } from "../drive/drive_embed.js";
import {
  ApplicationCommandOptionType,
  SlashCommandBooleanOption,
} from "discord.js";

const DRIVE_LINK = process.env.DRIVE_LINK ?? "";

const Drive: DiscordCommand = {
  name: "drive",
  description: "Download files from the google drive",
  log: false,
  options: [
    {
      type: ApplicationCommandOptionType.Boolean,
      option: new SlashCommandBooleanOption()
        .setName("link")
        .setDescription("Get google drive link for uploading")
        .setRequired(false),
    },
  ],
  execute: async (interaction) => {
    const link = interaction.options.getBoolean("link") ?? false;

    if (link) {
      await interaction.reply(`Upload new files here: ${DRIVE_LINK}`);
      return;
    }
    await interaction.deferReply();

    const driveEmbed = new DriveEmbedManager(interaction, driveState.Start);
    await driveEmbed.refresh(true);

    // Run all drive folders
    await checkDriveBulborb(driveEmbed);
    await checkDriveCat(driveEmbed);
    await checkDriveMeme(driveEmbed);

    await driveEmbed.finish(driveState.Complete);
  },
};

export default Drive;
