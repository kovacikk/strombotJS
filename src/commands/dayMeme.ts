import type { DiscordCommand } from "../types.js";
import { getRandomDayMeme, getDayMemes } from "../data/data_controller";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  SlashCommandBooleanOption,
  SlashCommandStringOption,
} from "discord.js";
import { getEmbedPages, replyPagedEmbeds } from "./helpers.js";
import { DayCategory } from "../media/media_types.js";

const DayMeme: DiscordCommand = {
  name: "daymeme",
  description: "Get a random meme based on the day of the week",
  log: true,
  options: [
    {
      type: ApplicationCommandOptionType.String,
      option: new SlashCommandStringOption()
        .setName("query")
        .setDescription("The substring you want to look day memes with")
        .setRequired(false),
    },
    {
      type: ApplicationCommandOptionType.Boolean,
      option: new SlashCommandBooleanOption()
        .setName("list")
        .setDescription("List day memes instead of uploading")
        .setRequired(false),
    },
    {
      type: ApplicationCommandOptionType.Boolean,
      option: new SlashCommandBooleanOption()
        .setName("recent")
        .setDescription("Only get recently uploaded day memes")
        .setRequired(false),
    },
  ],
  execute: async (interaction) => {
    const query = interaction.options.getString("query")?.toLowerCase() ?? "";
    const list = interaction.options.getBoolean("list") ?? false;
    const recent = interaction.options.getBoolean("recent") ?? false;

    // Get current day of the week
    const today = new Date();
    const day = today
      .toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "America/New_York",
      })
      .toLowerCase() as DayCategory;

    if (list) {
      // List Memes
      const dayMemes = await getDayMemes(day, {
        contains: query,
        recent,
      });

      if (dayMemes.length == 0) {
        await interaction.reply(`No valid day memes found`);
        return;
      }

      const pages = getEmbedPages(
        "Day Memes",
        dayMemes.flatMap((dayMeme) => dayMeme.name),
      );

      await replyPagedEmbeds(interaction, pages);
    } else {
      // Random Day Meme
      const dayMeme = await getRandomDayMeme(day, {
        contains: query,
        recent,
      });

      if (!dayMeme) {
        await interaction.reply(`No valid day meme found`);
        return;
      }

      const file = new AttachmentBuilder(dayMeme?.path ?? "", {
        name: dayMeme?.name ?? "",
      });

      await interaction.reply({
        files: [file],
      });
    }
  },
};

export default DayMeme;
