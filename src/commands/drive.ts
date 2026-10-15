import type { DiscordCommand } from "../types.js";
import { checkDrive as checkDriveBulborb } from "../media/bulborbs/bulborb_controller.js";

const Drive: DiscordCommand = {
  name: "drive",
  description: "Download files from the google drive",
  execute: async (interaction) => {
    await interaction.reply("Checking the Google Drive");

    const bulborbResults = await checkDriveBulborb();
    interaction.followUp(
      `Bulborbs Completed\n${bulborbResults.duplicates.length} duplicates\n${bulborbResults.new.length} new`,
    );

    await interaction.followUp(`Download Complete`);
  },
};

export default Drive;
