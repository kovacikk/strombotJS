import type { DiscordCommand } from "../types.js";
import { getMeme, getMemes } from "../data/data_controller";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  SlashCommandBooleanOption,
  SlashCommandStringOption,
} from "discord.js";
import { getEmbedPages, replyPagedEmbeds } from "./helpers.js";

const Meme: DiscordCommand = {
  name: "meme",
  description: "Get a random meme",
  log: true,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      option: new SlashCommandStringOption()
        .setName("query")
        .setDescription("The substring you want to look memes with")
        .setRequired(false),
    },
    {
      type: ApplicationCommandOptionType.Boolean,
      option: new SlashCommandBooleanOption()
        .setName("list")
        .setDescription("List memes instead of uploading")
        .setRequired(false),
    },
  ],
  execute: async (interaction) => {
    const query = interaction.options.getString("query")?.toLowerCase() ?? "";
    const list = interaction.options.getBoolean("list") ?? false;

    if (list) {
      // List Memes
      const memes = await getMemes({
        contains: query,
      });

      if (memes.length == 0) {
        await interaction.reply(`No valid memes found`);
        return;
      }

      const pages = getEmbedPages(
        "Memes",
        memes.flatMap((meme) => meme.name),
      );

      await replyPagedEmbeds(interaction, pages);
    } else {
      // Random Meme
      const meme = await getMeme({
        contains: query,
      });

      if (!meme) {
        await interaction.reply(`No valid meme found`);
        return;
      }

      const file = new AttachmentBuilder(meme?.path ?? "", {
        name: meme?.name ?? "",
      });

      await interaction.reply({
        files: [file],
      });
    }
  },
};

export default Meme;
