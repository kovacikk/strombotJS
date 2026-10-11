import type { DiscordCommand } from "../types.js";
import { syncAll } from "../media/media_controller.js";

const Sync: DiscordCommand = {
  name: "sync",
  description: "Downloads new files from the google drive",
  execute: async (interaction) => {
    await interaction.reply("Searching the google drive for new files");

    await syncAll();

    await interaction.followUp("Download complete");
  },
};

export default Sync;
