import { ChatInputCommandInteraction } from 'discord.js'
import type { CacheType } from 'discord.js';

export type DiscordCommand = {
    name: string;
    description: string;
    execute: (interaction: ChatInputCommandInteraction<CacheType>) => void;
};