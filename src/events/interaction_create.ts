import type { DiscordEvent } from "../types.js";
import { Events, MessageFlags } from "discord.js";
import type {
  Interaction,
  CacheType,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
} from "discord.js";
import { getCommandMap, getModalMap } from "../helpers.js";
import { logCommand } from "../log/log_controller.js";

const commandMap = getCommandMap();
const modalMap = getModalMap();

const InteractionCreate: DiscordEvent = {
  name: Events.InteractionCreate,
  execute: async (interaction: Interaction<CacheType>) => {
    if (interaction.isModalSubmit()) {
      await handleModal(interaction);
    }

    if (interaction.isChatInputCommand()) {
      await handleCommand(interaction);
    }
  },
};

async function handleModal(
  interaction: ModalSubmitInteraction<CacheType>,
): Promise<void> {
  const modal = modalMap.get(interaction.customId);

  if (!modal) {
    console.error(`No modal matching ${interaction.customId} was found.`);
    return;
  }

  try {
    console.log(`Running modal ${interaction.customId}`);
    await modal.execute(interaction);
  } catch (error) {
    console.error(`Failed to run modal ${interaction.customId}`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this modal!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this modal!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
}

async function handleCommand(
  interaction: ChatInputCommandInteraction<CacheType>,
): Promise<void> {
  const command = commandMap.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  // Log command
  if (command.log) {
    await logCommand(interaction.user, command);
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
}

export default InteractionCreate;
