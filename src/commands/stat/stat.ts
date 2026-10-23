import { getUser } from "../../data/data_controller.js";
import type { DiscordCommand } from "../../types.js";
import {
  AttachmentBuilder,
  ApplicationCommandOptionType,
  SlashCommandMentionableOption,
  User,
} from "discord.js";
import { buildStats } from "./stat_embed.js";

const Stat: DiscordCommand = {
  name: "stat",
  description: "Get user stats",
  log: true,
  options: [
    {
      type: ApplicationCommandOptionType.Mentionable,
      option: new SlashCommandMentionableOption()
        .setName("user")
        .setDescription("The user you want to view stats of")
        .setRequired(false),
    },
  ],
  execute: async (interaction) => {
    let user = interaction.options.getMentionable("user");

    console.log(`User info: `, user);

    if (user && !("user" in user || "bot" in user)) {
      interaction.reply(
        `Invalid mention provided. Make sure to provide a user and not a role.`,
      );
      return;
    }

    if (!user) {
      user = interaction.user;
    }

    console.log(`User id: ${user.id}`);

    const dbUser = await getUser(user.id);

    // Reply with no information found if not in db
    if (!dbUser) {
      interaction.reply(`No stats found for that user`);
      return;
    }

    const embed = await buildStats(user, dbUser);
    interaction.reply({
      embeds: [embed],
    });
  },
};

export default Stat;
