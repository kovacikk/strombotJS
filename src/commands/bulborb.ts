import type { DiscordCommand } from "../types.js";
import { getBulborb, getBulborbs } from "../data/data_controller.js";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  SlashCommandBooleanOption,
  SlashCommandStringOption,
} from "discord.js";
import { getEmbedPages, replyPagedEmbeds } from "./helpers.js";

const Bulborb: DiscordCommand = {
  name: "bulborb",
  description: "Get a random bulborb",
  log: true,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      option: new SlashCommandStringOption()
        .setName("query")
        .setDescription("The substring you want to look bulborbs with")
        .setRequired(false),
    },
    {
      type: ApplicationCommandOptionType.Boolean,
      option: new SlashCommandBooleanOption()
        .setName("list")
        .setDescription("List bulborbs instead of uploading")
        .setRequired(false),
    },
  ],
  execute: async (interaction) => {
    const query = interaction.options.getString("query")?.toLowerCase() ?? "";
    const list = interaction.options.getBoolean("list") ?? false;

    if (list) {
      // List Bulborbs
      const bulborbs = await getBulborbs({
        contains: query,
      });

      if (bulborbs.length == 0) {
        await interaction.reply(`No valid bulborbs found`);
        return;
      }

      const pages = getEmbedPages(
        "Bulborbs",
        bulborbs.flatMap((bulborb) => bulborb.name),
      );

      await replyPagedEmbeds(interaction, pages);
    } else {
      // Random Bulborb
      const bulborb = await getBulborb({
        contains: query,
      });

      if (!bulborb) {
        await interaction.reply(`No valid bulborb found`);
        return;
      }

      const file = new AttachmentBuilder(bulborb?.path ?? "", {
        name: bulborb?.name ?? "",
      });

      await interaction.reply({
        files: [file],
      });
    }
  },
};

export default Bulborb;
