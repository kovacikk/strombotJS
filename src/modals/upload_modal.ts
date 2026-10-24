import { DiscordModal } from "../types";
import { isCategoryType, isDayCategoryType } from "../media/media_types";
import { Category, DayCategory } from "../media/media_types";
import { dayMediaPaths } from "../media/dayMemes/day_meme_controller";
import { categoryPathMap } from "../media/media_helpers";
import * as fs from "fs";
import { Readable } from "stream";
import { streamToFile } from "../drive/drive_controller.js";
import { sync } from "../media/media_controller";
import { getItemsByField } from "../data/data_controller";

const UploadModal: DiscordModal = {
  name: "upload_modal",
  description: "Saves uploaded files",
  execute: async (interaction) => {
    const category = interaction.fields.getStringSelectValues("category")[0];
    const dayCategory =
      interaction.fields.getStringSelectValues("day_category")[0];
    const uploadedFiles = interaction.fields.getUploadedFiles("files");

    await interaction.deferReply();

    if (!category) {
      return await interaction.editReply("Error: No category was chosen");
    }

    if (!isCategoryType(category)) {
      return await interaction.editReply(
        "Error: An invalid category was chosen",
      );
    }

    if (!uploadedFiles || uploadedFiles.size === 0) {
      return await interaction.editReply("Error: No files were uploaded");
    }

    let path: string | undefined = "";
    if (category == Category.DayMeme) {
      if (!dayCategory) {
        return await interaction.editReply(
          "Error: You must choose a day category if uploading a day meme",
        );
      }

      if (!isDayCategoryType(dayCategory)) {
        return await interaction.editReply(
          "Error: An invalid day category was chosen",
        );
      }

      path = dayMediaPaths[dayCategory];
    } else {
      path = categoryPathMap[category];
    }

    if (!path) {
      throw new Error(`Error finding path for ${category}`);
    }

    const files = Array.from(uploadedFiles.values());
    await interaction.editReply(
      `Downloading ${files.length} ${category}${files.length > 1 ? "s" : ""}...`,
    );

    let duplicateFiles: string[] = [];
    let failedFiles: string[] = [];
    for (const file of files) {
      const fullPath = path + file.name;
      const existingNames = await getItemsByField(
        category,
        [file.name],
        "name",
      );

      if (existingNames.length > 0) {
        duplicateFiles.push(file.name);
        continue;
      }

      try {
        const stream = fs.createWriteStream(fullPath);
        const response = await fetch(file.url);

        if (!response.ok || !response.body) {
          throw new Error(
            `Failed to fetch the file from discord: ${response.statusText}`,
          );
        }

        const nodeStream = Readable.fromWeb(response.body as any);
        await streamToFile(nodeStream, stream);
      } catch (error) {
        console.error(error);
        failedFiles.push(file.name);
        continue;
      }
    }

    await sync(
      category == Category.DayMeme ? (dayCategory as DayCategory) : category,
    );

    const successCount =
      files.length - (duplicateFiles.length + failedFiles.length);
    const responseComponents: string[] = [];
    if (successCount > 0) {
      responseComponents.push(
        `Successfully uploaded ${successCount} ${category}${successCount > 1 ? "s" : ""}!`,
      );
    }

    const issues: string[] = [];

    if (duplicateFiles.length > 0) {
      issues.push(
        `Existing file name${duplicateFiles.length > 1 ? "s" : ""} found: **${duplicateFiles.join(", ")}**. Please rename to a unique name.`,
      );
    }
    if (failedFiles.length > 0) {
      issues.push(
        `Failed file name${failedFiles.length > 1 ? "s" : ""}: **${failedFiles.join(", ")}**. Please try reuploading or reducing file size.`,
      );
    }

    if (issues.length > 0) {
      responseComponents.push(issues.join("\n"));
    }

    await interaction.editReply(responseComponents.join("\n\n"));
  },
};

export default UploadModal;
