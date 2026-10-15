import type { DiscordCommand } from "./types.js";
import {
  ApplicationCommandOptionType,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

import allCommands from "./commands/index.js";

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
      if (option.type === ApplicationCommandOptionType.String) {
        slashCommand.addStringOption(option.option as SlashCommandStringOption);
      }
      //...add as needed
    }

    if (slashCommand) {
      slashCommands.push(slashCommand.toJSON());
    }
  }
  return slashCommands;
}
