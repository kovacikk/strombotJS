import {
  ChatInputCommandInteraction,
  ApplicationCommandOptionBase,
  ApplicationCommandOptionType,
} from "discord.js";
import type { CacheType, Client, ModalSubmitInteraction } from "discord.js";

export type DiscordCommand = {
  name: string;
  description: string;
  log: boolean;
  options?: {
    type: ApplicationCommandOptionType;
    option: ApplicationCommandOptionBase;
  }[];
  execute: (interaction: ChatInputCommandInteraction<CacheType>) => void;
};

export type DiscordEvent = {
  name: string;
  once?: true;
  execute: (...args: any[]) => void;
};

export type DiscordCron = {
  name: string;
  pattern: string;
  execute: (client: Client) => void;
};

export type DiscordModal = {
  name: string;
  description: string;
  execute: (interaction: ModalSubmitInteraction<CacheType>) => void;
};
