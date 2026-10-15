import type { DiscordCommand } from "../types.js";
import { getBulborb } from "../data/data_controller.js";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  SlashCommandStringOption,
} from "discord.js";

const Bulborb: DiscordCommand = {
  name: "bulborb",
  description: "Get a random bulborb",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      option: new SlashCommandStringOption()
        .setName("query")
        .setDescription("The substring you want to look bulborbs with")
        .setRequired(false),
    },
  ],
  execute: async (interaction) => {
    const query = interaction.options.getString("query") ?? "";

    const bulborb = await getBulborb({
      contains: query.toLowerCase(),
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
  },
};

export default Bulborb;
