import type { DiscordCommand } from './commands/shared_types.ts';
import { SlashCommandBuilder } from 'discord.js';
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

import allCommands from './commands/index.js';


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

export function buildCommands(commands: DiscordCommand[]): RESTPostAPIChatInputApplicationCommandsJSONBody[] {
    const slashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    for (const command of commands) {
        const slashCommand = new SlashCommandBuilder().setName(command.name).setDescription(command.description);

        if (slashCommand) {
            slashCommands.push(slashCommand.toJSON());
        }
    }
    return slashCommands;
}