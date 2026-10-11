import type { DiscordEvent } from "../types.js";
import { Events, MessageFlags } from "discord.js";
import type { Interaction, CacheType } from "discord.js";
import { getCommandMap } from "../helpers.js";

const commandMap = getCommandMap();

const InteractionCreate: DiscordEvent = {
  name: Events.InteractionCreate,
  execute: async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commandMap.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    try {
      console.log(`Running command ${interaction.commandName}`);
      await command.execute(interaction);
    } catch (error) {
      console.error(`Failed to run command ${interaction.commandName}`, error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};

export default InteractionCreate;
