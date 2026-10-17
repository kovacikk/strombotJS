import type { DiscordCommand } from "../types.js";
import { getCat, getCats } from "../data/data_controller.js";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  SlashCommandBooleanOption,
  SlashCommandStringOption,
} from "discord.js";
import { getEmbedPages, replyPagedEmbeds } from "./helpers.js";

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
  ],
  execute: async (interaction) => {
    const query = interaction.options.getString("query")?.toLowerCase() ?? "";
    const list = interaction.options.getBoolean("list") ?? false;

    if (list) {
      // List Cats
      const cats = await getCats({
        contains: query,
      });

      if (cats.length == 0) {
        await interaction.reply(`No valid cats found`);
        return;
      }

      const pages = getEmbedPages(
        "Cats",
        cats.flatMap((cat) => cat.name),
      );

      await replyPagedEmbeds(interaction, pages);
    } else {
      // Random Cat
      const cat = await getCat({
        contains: query,
      });

      if (!cat) {
        await interaction.reply(`No valid cat found`);
        return;
      }

      const file = new AttachmentBuilder(cat?.path ?? "", {
        name: cat?.name ?? "",
      });

      await interaction.reply({
        files: [file],
      });
    }
  },
};

export default Cat;
