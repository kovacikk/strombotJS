import { getUser } from "../../data/data_controller";
import type { DiscordCommand } from "../../types.js";
import {
  ApplicationCommandOptionType,
  SlashCommandUserOption,
} from "discord.js";
import { buildStats } from "./stat_embed.js";

const Stat: DiscordCommand = {
  name: "stat",
  description: "Get user stats",
  log: true,
  options: [
    {
      type: ApplicationCommandOptionType.User,
      option: new SlashCommandUserOption()
        .setName("user")
        .setDescription("The user you want to view stats of")
        .setRequired(false),
    },
  ],
  execute: async (interaction) => {
    await interaction.deferReply();

    let user = interaction.options.getUser("user");

    if (user && !("user" in user || "bot" in user)) {
      interaction.editReply(
        `Invalid mention provided. Make sure to provide a user and not a role.`,
      );
      return;
    }

    if (!user) {
      user = interaction.user;
    }

    const dbUser = await getUser(user.id);

    // Reply with no information found if not in db
    if (!dbUser) {
      interaction.editReply(`No stats found for that user`);
      return;
    }

    const embed = await buildStats(user, dbUser);
    interaction.editReply({
      embeds: [embed],
    });
  },
};

export default Stat;
