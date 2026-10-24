import type { DiscordCommand } from "../types.js";
import {
  ModalBuilder,
  FileUploadBuilder,
  LabelBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

const Upload: DiscordCommand = {
  name: "upload",
  description: "Upload up to 10 files to a category",
  log: true,
  execute: async (interaction) => {
    const modal = buildUploadModal();

    await interaction.showModal(modal);
  },
};

function buildUploadModal(): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId("upload_modal")
    .setTitle("Strombot File Upload");

  const fileUpload = new FileUploadBuilder()
    .setCustomId("files")
    .setMinValues(1)
    .setMaxValues(10)
    .setRequired(true);

  const fileLabelContainer = new LabelBuilder()
    .setLabel("Files")
    .setFileUploadComponent(fileUpload);

  const categorySelect = new StringSelectMenuBuilder()
    .setCustomId("category")
    .setPlaceholder("Choose a category")
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Bulborb")
        .setValue("bulborb"),
      new StringSelectMenuOptionBuilder().setLabel("Cat").setValue("cat"),
      new StringSelectMenuOptionBuilder().setLabel("Meme").setValue("meme"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Day Meme")
        .setValue("day_meme"),
      new StringSelectMenuOptionBuilder().setLabel("Weevil").setValue("weevil"),
    );

  const categoryLabel = new LabelBuilder()
    .setLabel("Category")
    .setDescription("Select where this file will be uploaded.")
    .setStringSelectMenuComponent(categorySelect);

  const daySelect = new StringSelectMenuBuilder()
    .setCustomId("day_category")
    .setPlaceholder("Optional: Choose a day")
    .addOptions(
      new StringSelectMenuOptionBuilder().setLabel("Monday").setValue("monday"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Tuesday")
        .setValue("tuesday"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Wednesday")
        .setValue("wednesday"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Thursday")
        .setValue("thursday"),
      new StringSelectMenuOptionBuilder().setLabel("Friday").setValue("friday"),
      new StringSelectMenuOptionBuilder()
        .setLabel("Saturday")
        .setValue("saturday"),
      new StringSelectMenuOptionBuilder().setLabel("Sunday").setValue("sunday"),
    )
    .setRequired(false);

  const dayCategoryLabel = new LabelBuilder()
    .setLabel("Day Category")
    .setDescription(
      "Select what day this file is for. Only used if this is a day meme.",
    )
    .setStringSelectMenuComponent(daySelect);

  modal.addLabelComponents(fileLabelContainer, categoryLabel, dayCategoryLabel);

  return modal;
}

export default Upload;
