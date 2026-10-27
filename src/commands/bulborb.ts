import type { DiscordCommand } from "../types.js";
import { getRandomItem, getItems } from "../data/data_controller";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  SlashCommandBooleanOption,
  SlashCommandStringOption,
} from "discord.js";
import { getEmbedPages, replyPagedEmbeds } from "./helpers.js";
import { Bulborb as BulborbEntity } from "../data/entities/Bulborb.js";
import { readFileSync } from "node:fs";

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
    {
      type: ApplicationCommandOptionType.Boolean,
      option: new SlashCommandBooleanOption()
        .setName("recent")
        .setDescription("Only get recently uploaded bulborbs")
        .setRequired(false),
    },
  ],
  execute: async (interaction) => {
    await interaction.deferReply();

    const query = interaction.options.getString("query")?.toLowerCase() ?? "";
    const list = interaction.options.getBoolean("list") ?? false;
    const recent = interaction.options.getBoolean("recent") ?? false;

    if (list) {
      // List Bulborbs
      const bulborbs = await getItems(BulborbEntity, {
        contains: query,
        recent,
      });

      if (bulborbs.length == 0) {
        await interaction.editReply(`No valid bulborbs found`);
        return;
      }

      const pages = getEmbedPages(
        "Bulborbs",
        bulborbs.flatMap((bulborb) => bulborb.name),
      );

      await replyPagedEmbeds(interaction, pages);
    } else {
      // Random Bulborb
      const bulborb = await getRandomItem(BulborbEntity, {
        contains: query,
        recent,
      });

      if (!bulborb) {
        await interaction.editReply(`No valid bulborb found`);
        return;
      }

      console.log(`Uploading bulborb ${bulborb.name}`);
      const fileBuffer = readFileSync(bulborb?.path ?? "");
      const file = new AttachmentBuilder(fileBuffer, {
        name: bulborb?.name ?? "",
      });

      await interaction.editReply({
        files: [file],
      });
    }
  },
};

export default Bulborb;
