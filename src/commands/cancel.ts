import type { DiscordCommand } from "../types.js";
import {
  getCancels,
  getOrCreateUser,
  incrementCancel,
} from "../data/data_controller";
import {
  ApplicationCommandOptionType,
  SlashCommandBooleanOption,
  GuildMember,
  ChatInputCommandInteraction,
  CacheType,
} from "discord.js";
import { getEmbedPages, replyPagedEmbeds } from "./helpers.js";
import { Collection } from "discord.js";

const DREW_USER_ID = "159433180036726784";

const Cancel: DiscordCommand = {
  name: "cancel",
  description: "Cancel someone",
  log: true,
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
      await sendList(interaction, members);
    } else {
      // Cancel Someone

      let cancelledMember: GuildMember | undefined;

      // 20% Chance to hit Drew
      if (Math.floor(Math.random() * 10) < 2) {
        cancelledMember = members?.get(DREW_USER_ID);
      } else {
        cancelledMember = members?.random();
      }

      if (cancelledMember) {
        const user = await getOrCreateUser(cancelledMember.id);

        const roll = rollCancelAmount();

        await incrementCancel(user, roll.amount);

        await interaction.reply(
          `${cancelledMember.displayName} ${roll.reason}`,
        );
      } else {
        await interaction.reply("There was a problem finding a cancel target");
      }
    }
  },
};

type cancelRoll = {
  amount: number;
  reason: string;
};
function rollCancelAmount(): cancelRoll {
  const cancelRoll: number = Math.floor(Math.random() * 1000) + 1;

  switch (true) {
    // 0.1% Chance
    case cancelRoll === 1:
      return {
        amount: 10,
        reason: "is tonight's biggest loser (+10)",
      };
    // 1% Chance
    case cancelRoll <= 11:
      return {
        amount: 5,
        reason:
          "does something super embarrassing and is cancelled for it (+5)",
      };
    // 5% Chance
    case cancelRoll <= 61:
      return {
        amount: 3,
        reason: "is mega cancelled (+3)",
      };
    // 10% Chance
    case cancelRoll <= 161:
      return {
        amount: 2,
        reason: "is extra cancelled (+2)",
      };
    // Remainder ~84% Chance
    default:
      return {
        amount: 1,
        reason: "is cancelled",
      };
  }
}

async function sendList(
  interaction: ChatInputCommandInteraction<CacheType>,
  members: Collection<string, GuildMember> | undefined,
) {
  // Show Cancel Leaderboard
  let users = await getCancels();

  // Filter out Special Member
  const filteredUsers = users.filter((user) => !(user.id === DREW_USER_ID));

  const pages = getEmbedPages(
    "Cancel Leaderboard",
    filteredUsers.flatMap((user) => {
      const member = members?.get(user.id);
      return `${member?.displayName ?? user.id} - ${user.cancels}`;
    }),
    {
      emphasizeFirst: true,
      numbered: true,
    },
  );

  // Apply Drew Preamble
  const specialUser = users.find((user) => user.id === DREW_USER_ID);
  const specialMember = members?.get(DREW_USER_ID);
  if (pages[0] && specialUser && specialMember) {
    let description = pages[0].data?.description ?? "";

    description =
      `*${specialMember.displayName ?? specialUser.id} - ${specialUser.cancels}*` +
      "\n\n" +
      description;

    pages[0] = pages[0].setDescription(description);
  }

  // Emphasize Top Member
  const topMember = members?.get(filteredUsers[0]?.id ?? "");
  if (pages[0] && topMember) {
    pages[0] = pages[0].setThumbnail(topMember.displayAvatarURL());
  }

  await replyPagedEmbeds(interaction, pages);
}

export default Cancel;
