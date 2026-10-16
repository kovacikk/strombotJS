import type { DiscordCommand } from "../types.js";
import {
  getCancels,
  getOrCreateUser,
  incrementCancel,
} from "../data/data_controller.js";
import {
  ApplicationCommandOptionType,
  SlashCommandBooleanOption,
} from "discord.js";
import { getEmbedPages, replyPagedEmbeds } from "./helpers.js";

const Cancel: DiscordCommand = {
  name: "cancel",
  description: "Cancel someone",
  options: [
    {
      type: ApplicationCommandOptionType.Boolean,
      option: new SlashCommandBooleanOption()
        .setName("list")
        .setDescription("Show cancel leaderboard")
        .setRequired(false),
    },
  ],
  execute: async (interaction) => {
    const list = interaction.options.getBoolean("list") ?? false;

    const guild = interaction.guild;
    let members = await guild?.members.cache;
    if (!members || members.size <= 1) {
      members = await guild?.members.fetch();
    }

    if (list) {
      // Show Cancel Leaderboard
      const users = await getCancels();

      const pages = getEmbedPages(
        "Cancels",
        users.flatMap((user) => {
          const member = members?.get(user.id);
          return `${member?.displayName ?? user.id} - ${user.cancels}`;
        }),
        {
          numbered: true,
        },
      );

      await replyPagedEmbeds(interaction, pages);
    } else {
      // Cancel Someone

      const randomMember = members?.random();

      if (randomMember) {
        const user = await getOrCreateUser(randomMember.id);

        await incrementCancel(user, 1);

        await interaction.reply(
          `${randomMember.displayName} has been cancelled`,
        );
      } else {
        await interaction.reply("There was a problem finding a cancel target");
      }
    }
  },
};

export default Cancel;
