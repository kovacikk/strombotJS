import type { DiscordCommand, DiscordModal } from "./types.js";
import {
  ApplicationCommandOptionType,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import type {
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandUserOption,
} from "discord.js";

import allCommands from "./commands/index.js";
import allModals from "./modals/index.js";

export function getCommands(): DiscordCommand[] {
  return allCommands;
}

export function getCommandMap(): Map<string, DiscordCommand> {
  const commands = getCommands();

  const map = new Map<string, DiscordCommand>();

  for (const command of commands) {
    map.set(command.name, command);
  }

  return map;
}

export function buildCommands(
  commands: DiscordCommand[],
): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
  const slashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  for (const command of commands) {
    let slashCommand = new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description);

    for (const option of command.options ?? []) {
      switch (option.type) {
        case ApplicationCommandOptionType.String:
          slashCommand.addStringOption(
            option.option as SlashCommandStringOption,
          );
          break;
        case ApplicationCommandOptionType.Boolean:
          slashCommand.addBooleanOption(
            option.option as SlashCommandBooleanOption,
          );
          break;
        case ApplicationCommandOptionType.User:
          slashCommand.addUserOption(option.option as SlashCommandUserOption);
          break;
        case ApplicationCommandOptionType.Attachment:
          slashCommand.addAttachmentOption(
            option.option as SlashCommandAttachmentOption,
          );
          break;
        //...add as needed
      }
    }

    if (slashCommand) {
      slashCommands.push(slashCommand.toJSON());
    }
  }
  return slashCommands;
}

export function getModals(): DiscordModal[] {
  return allModals;
}

export function getModalMap(): Map<string, DiscordModal> {
  const modals = getModals();

  const map = new Map<string, DiscordModal>();

  for (const modal of modals) {
    map.set(modal.name, modal);
  }

  return map;
}
