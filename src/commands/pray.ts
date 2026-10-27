import type { DiscordCommand } from "../types.js";
import {
  getCancels,
  getDevotion,
  getOrCreateUser,
  incrementCancel,
  incrementDevotion,
} from "../data/data_controller.js";
import {
  ApplicationCommandOptionType,
  SlashCommandBooleanOption,
  GuildMember,
  ChatInputCommandInteraction,
  CacheType,
  InteractionEditReplyOptions,
} from "discord.js";
import { getEmbedPages, replyPagedEmbeds } from "./helpers.js";
import { Collection, InteractionReplyOptions } from "discord.js";

const WINKY_BLINK_PATH = "/app/media/events/pray/winky_blink.gif";
const WINKY_MAD_PATH = "/app/media/events/pray/winky_mad.png";

const WINKY_FRIB_PATH = "/app/media/events/pray/winky_frib.gif";
const WINKY_HOP_PATH = "/app/media/events/pray/winky_hop.gif";
const WINKY_BIG_HOP_PATH = "/app/media/events/pray/winky_hop_slow.gif";
const WINKY_SWIM_PATH = "/app/media/events/pray/winky_swim.gif";
const WINKY_LICK_PATH = "/app/media/events/pray/winky_lick.gif";

const WINKY_PRIDE_PATH = "/app/media/events/pray/winky_pride.gif";

const Pray: DiscordCommand = {
  name: "pray",
  description: "Pray to Winky",
  log: true,
  options: [
    {
      type: ApplicationCommandOptionType.Boolean,
      option: new SlashCommandBooleanOption()
        .setName("list")
        .setDescription("Show prayer leaderboard")
        .setRequired(false),
    },
  ],
  execute: async (interaction) => {
    await interaction.deferReply();

    const list = interaction.options.getBoolean("list") ?? false;

    if (list) {
      await sendList(interaction);
    } else {
      // Pray to Winky
      const user = await getOrCreateUser(interaction.user.id);

      const roll = rollPrayer(user.lastPrayer);
      await incrementDevotion(user, roll.amount, roll.setLastPrayer);

      const message: InteractionEditReplyOptions = {
        content: `${roll.reason} **(${roll.amount >= 0 ? "+" + roll.amount : roll.amount})**`,
      };

      if (roll.file) {
        message.files = [roll.file];
      }

      await interaction.editReply(message);
    }
  },
};

function chooseRandom<T>(list: T[]): T {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex] as T;
}

enum PrayerRoll {
  Normal,
  Good,
  Great,
  Super,
  Amazing,
  Perfect,
}

type OutcomeTier = {
  type: PrayerRoll;
  weight: number;
};

const GOOD_OUTCOMES: OutcomeTier[] = [
  { type: PrayerRoll.Normal, weight: 45 },
  { type: PrayerRoll.Good, weight: 25 },
  { type: PrayerRoll.Great, weight: 15 },
  { type: PrayerRoll.Super, weight: 10 },
  { type: PrayerRoll.Amazing, weight: 5 },
  { type: PrayerRoll.Perfect, weight: 1 },
];

type PrayerOutcome = {
  amount: number;
  reason: string;
  file?: string;
  setLastPrayer: boolean;
};
function rollPrayer(lastPrayer: Date): PrayerOutcome {
  const current = new Date();
  const oneDayInMs = 1 * 24 * 60 * 60 * 1000;

  // Check if time has not expired
  if (lastPrayer && current.getTime() - lastPrayer.getTime() < oneDayInMs) {
    const earlyOptions = [
      `Winky feels like you're coming on a little strong. Maybe wait a little before your next prayer.`,
      `Winky is tired of your persistence. Maybe take a break from praying for now.`,
      `"Frib...", Winky grumbles. Might want to slow down on prayers.`,
      `You pray too soon after your last one. Winky ghosts you.`,
    ];

    return {
      amount: 0,
      reason: chooseRandom(earlyOptions),
      setLastPrayer: false,
    };
  }

  const goodBadRoll = Math.random() * 100 < 70;
  if (goodBadRoll) {
    // 70% Good Outcome

    const goodRoll = rollGoodOutcome();

    switch (goodRoll) {
      case PrayerRoll.Normal:
        const normalOptions = [
          `Winky accepts your prayer. You think you hear a distant frib.`,
          `You clasp your hands together in prayer.`,
          `You pray to Winky and all the frogs out there.`,
          `"Oh great frog, please bless me with a hop", you say. Winky thinks about it.`,
        ];
        return {
          amount: 1,
          reason: chooseRandom(normalOptions),
          setLastPrayer: true,
          file: WINKY_FRIB_PATH,
        };
      case PrayerRoll.Good:
        const goodOptions = [
          `You recite the sacred texts. "When Him Hop, Me Hap". You feel Hap.`,
          `You try and let out a big frib. Winky frobs in response.`,
          `You offer up a worm to the altar. Winky approves.`,
        ];
        return {
          amount: 2,
          reason: chooseRandom(goodOptions),
          setLastPrayer: true,
          file: WINKY_HOP_PATH,
        };
      case PrayerRoll.Great:
        const greatOptions = [
          `Winky can tell you put your soul into this prayer. He not only fribs, but does a BIG hop in response.`,
          `Winky is in an extra good mood today. He give you a frib and a hop.`,
          `You came prepared wearing a matching red and green robe today. Winky likes it!`,
        ];
        return {
          amount: 3,
          reason: chooseRandom(greatOptions),
          setLastPrayer: true,
          file: WINKY_BIG_HOP_PATH,
        };
      case PrayerRoll.Super:
        const superOptions = [
          `You feel like a frog yourself today. Your frib resonates with Winky.`,
          `While praying you hop as high as you can. Winky is impressed!`,
          `You did some laps in the pool before praying. You feel your inner frog.`,
        ];
        return {
          amount: 4,
          reason: chooseRandom(superOptions),
          setLastPrayer: true,
          file: WINKY_SWIM_PATH,
        };
      case PrayerRoll.Amazing:
        const amazingOptions = [
          `You feel Winky in your heart, and he feels you in his. "When Him Pray, Me Hop". And oh does he hop!`,
          `You imagine yourself as a frog. Winky is there with you! Frib, frob, frobbage!`,
          `You scream Winky's name in the middle of the street at 3am. You love FROGS!!!!!`,
        ];
        return {
          amount: 5,
          reason: chooseRandom(amazingOptions),
          setLastPrayer: true,
          file: WINKY_LICK_PATH,
        };
      case PrayerRoll.Perfect:
        const perfectOptions = [
          `This is it. Your prayer is so strong that you ascend to the heavens. Winky greets you with a proud Frib! Then, he does a hop! Whoa, whoa, whoa, whoa, whoa, whoa, WHOA! Winky comes over and gives your hand a LICK!!! You don't think you'll ever wash that hand again.`,
        ];
        return {
          amount: 10,
          reason: chooseRandom(perfectOptions),
          setLastPrayer: true,
          file: WINKY_PRIDE_PATH,
        };
    }
  } else {
    // 30% Bad Outcome

    const neutralRoll = Math.random() * 3 < 2;
    if (neutralRoll) {
      // 66% Neutral Outcome

      const neutralOptions = [
        `You pray but all you get is silence.`,
        `You're not feeling it today for some reason.`,
        `You decide to take a day off from praying today.`,
        `Winky is too busy fribbing and frobbing to care.`,
      ];
      return {
        amount: 0,
        reason: chooseRandom(neutralOptions),
        setLastPrayer: true,
        file: WINKY_BLINK_PATH,
      };
    } else {
      // 33% Bad Outcome

      const badOptions = [
        `You accidentally pray to that dork Rambi. Winky is not pleased.`,
        `You stumble over your sacred chant. That's embarrassing.`,
        `You try to frob, but frub instead. What kind of believer are you!?`,
        `You came to prayer wearing THAT???`,
        `You foolishly try to lick Winky. Know your place worm.`,
        `You get hungry and eat the fly you were going to offer. Hey, that was for Winky!`,
      ];
      return {
        amount: -1,
        reason: chooseRandom(badOptions),
        setLastPrayer: true,
        file: WINKY_MAD_PATH,
      };
    }
  }
}

function rollGoodOutcome(): PrayerRoll {
  const totalWeight = GOOD_OUTCOMES.reduce((sum, tier) => sum + tier.weight, 0);

  const roll = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  for (const tier of GOOD_OUTCOMES) {
    cumulativeWeight += tier.weight;
    if (roll < cumulativeWeight) {
      return tier.type;
    }
  }

  return GOOD_OUTCOMES[GOOD_OUTCOMES.length - 1]?.type as PrayerRoll;
}

async function sendList(interaction: ChatInputCommandInteraction<CacheType>) {
  const guild = interaction.guild;
  let members = await guild?.members.cache;
  if (!members || members.size <= 1) {
    members = await guild?.members.fetch();
  }

  // Show Prayer Leaderboard
  let users = await getDevotion();

  const pages = getEmbedPages(
    "Prayer Leaderboard",
    users.flatMap((user) => {
      const member = members?.get(user.id);
      return `${member?.displayName ?? user.id} - ${user.devotion}`;
    }),
    {
      emphasizeFirst: true,
      numbered: true,
    },
  );

  // Emphasize Top Member
  const topMember = members?.get(users[0]?.id ?? "");
  if (pages[0] && topMember) {
    pages[0] = pages[0].setThumbnail(topMember.displayAvatarURL());
  }

  await replyPagedEmbeds(interaction, pages);
}

export default Pray;
