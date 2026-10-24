import type { DiscordCommand } from "../types.js";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  SlashCommandAttachmentOption,
  SlashCommandStringOption,
} from "discord.js";
import * as fs from "fs";
import { Readable } from "stream";
import { streamToFile } from "../drive/drive_controller";
import { dayMediaPaths } from "../media/dayMemes/day_meme_controller";
import { sync } from "../media/media_controller";
import {
  Category,
  DayCategory,
  isCategoryType,
  isDayCategoryType,
} from "../media/media_types.js";
import { categoryFunctionMap } from "../data/data_helpers.js";
import { categoryPathMap } from "../media/media_helpers.js";

const Upload: DiscordCommand = {
  name: "upload",
  description: "Upload up to 10 files to a category",
  log: true,
  options: [
    {
      type: ApplicationCommandOptionType.Attachment,
      option: new SlashCommandAttachmentOption()
        .setName("file")
        .setDescription("The file you want to upload")
        .setRequired(true),
    },
    {
      type: ApplicationCommandOptionType.String,
      option: new SlashCommandStringOption()
        .setName("category")
        .setDescription("Choose where you want to upload your files to")
        .setRequired(true)
        .addChoices(
          { name: "Bulborb", value: "bulborb" },
          { name: "Cat", value: "cat" },
          { name: "Meme", value: "meme" },
          { name: "Day Meme", value: "day_meme" },
          { name: "Weevil", value: "weevil" },
        ),
    },
    {
      type: ApplicationCommandOptionType.String,
      option: new SlashCommandStringOption()
        .setName("day_category")
        .setDescription("If this is a day meme, choose the day this belongs to")
        .setRequired(false)
        .addChoices(
          { name: "Monday", value: "monday" },
          { name: "Tuesday", value: "tuesday" },
          { name: "Wednesday", value: "wednesday" },
          { name: "Thursday", value: "thursday" },
          { name: "Friday", value: "friday" },
          { name: "Saturday", value: "saturday" },
          { name: "Sunday", value: "sunday" },
        ),
    },
  ],
  execute: async (interaction) => {
    const category = interaction.options.getString("category");
    const dayCategory = interaction.options.getString("day_category");
    const file = interaction.options.getAttachment("file");

    await interaction.deferReply();

    if (!category) {
      return await interaction.editReply("No category was chosen");
    }

    if (!isCategoryType(category)) {
      return await interaction.editReply("An invalid category was chosen");
    }

    if (!file) {
      return await interaction.editReply("No file was uploaded");
    }

    let path: string | undefined = "";
    if (category == Category.DayMeme) {
      if (!dayCategory) {
        return await interaction.editReply(
          "You must choose a day category if uploading a day meme",
        );
      }

      if (!isDayCategoryType(dayCategory)) {
        return await interaction.editReply(
          "An invalid day category was chosen",
        );
      }

      path = dayMediaPaths[dayCategory];
    } else {
      path = categoryPathMap[category];
    }

    if (!path) {
      throw new Error(`Error finding path for ${category}`);
    }

    const fullPath = path + file.name;
    const existingNames = await categoryFunctionMap[category]([file.name]);

    if (existingNames.length > 0) {
      return await interaction.editReply(
        `A file with name **${file.name}** already exists. Please choose a unique name.`,
      );
    }

    try {
      await interaction.editReply(`Downloading **${file.name}**...`);

      const stream = fs.createWriteStream(fullPath);
      const response = await fetch(file.url);

      if (!response.ok || !response.body) {
        throw new Error(
          `Failed to fetch the file from discord: ${response.statusText}`,
        );
      }

      const nodeStream = Readable.fromWeb(response.body as any);
      await streamToFile(nodeStream, stream);

      await sync(
        category == Category.DayMeme ? (dayCategory as DayCategory) : category,
      );

      const newFile = new AttachmentBuilder(fullPath, {
        name: file.name,
      });

      await interaction.editReply({
        content: `New ${category} **${file.name}** was successfully uploaded!`,
        files: [newFile],
      });
    } catch (error) {
      console.error(error);
      return await interaction.editReply(
        `Failed to download file ${file.name}`,
      );
    }
  },
};

export default Upload;
