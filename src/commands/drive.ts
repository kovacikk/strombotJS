import type { DiscordCommand } from "../types.js";
import { checkDrive as checkDriveBulborb } from "../media/bulborbs/bulborb_controller.js";
import { DriveEmbedManager, driveState } from "../drive/drive_embed.js";
import {
  ApplicationCommandOptionType,
  Embed,
  EmbedBuilder,
  SlashCommandBooleanOption,
} from "discord.js";
import { progressString } from "./helpers.js";

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

    await checkDriveBulborb(driveEmbed);

    await checkDriveBulborb(driveEmbed);

    await checkDriveBulborb(driveEmbed);

    driveEmbed.setState(driveState.Complete);
    await driveEmbed.refresh(true);
  },
};

export default Drive;
