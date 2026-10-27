import type { DiscordCommand } from "../types.js";
import { getRandomItem, getItems } from "../data/data_controller";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  SlashCommandBooleanOption,
  SlashCommandStringOption,
} from "discord.js";
import { getEmbedPages, replyPagedEmbeds } from "./helpers.js";
import { Cat as CatEntity } from "../data/entities/Cat.js";
import { readFileSync } from "node:fs";

const Cat: DiscordCommand = {
  name: "cat",
  description: "Get a random cat",
  log: true,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      option: new SlashCommandStringOption()
        .setName("query")
        .setDescription("The substring you want to look cats with")
        .setRequired(false),
    },
    {
      type: ApplicationCommandOptionType.Boolean,
      option: new SlashCommandBooleanOption()
        .setName("list")
        .setDescription("List cats instead of uploading")
        .setRequired(false),
    },
    {
      type: ApplicationCommandOptionType.Boolean,
      option: new SlashCommandBooleanOption()
        .setName("recent")
        .setDescription("Only get recently uploaded cats")
        .setRequired(false),
    },
  ],
  execute: async (interaction) => {
    await interaction.deferReply();

    const query = interaction.options.getString("query")?.toLowerCase() ?? "";
    const list = interaction.options.getBoolean("list") ?? false;
    const recent = interaction.options.getBoolean("recent") ?? false;

    if (list) {
      // List Cats
      const cats = await getItems(CatEntity, {
        contains: query,
        recent,
      });

      if (cats.length == 0) {
        await interaction.editReply(`No valid cats found`);
        return;
      }

      const pages = getEmbedPages(
        "Cats",
        cats.flatMap((cat) => cat.name),
      );

      await replyPagedEmbeds(interaction, pages);
    } else {
      // Random Cat
      const cat = await getRandomItem(CatEntity, {
        contains: query,
        recent,
      });

      if (!cat) {
        await interaction.editReply(`No valid cat found`);
        return;
      }

      console.log(`Uploading cat ${cat.name}`);
      const fileBuffer = readFileSync(cat?.path ?? "");
      const file = new AttachmentBuilder(fileBuffer, {
        name: cat?.name ?? "",
      });

      await interaction.editReply({
        files: [file],
      });
    }
  },
};

export default Cat;
