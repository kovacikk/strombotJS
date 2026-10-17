import {
  ActionRowBuilder,
  ButtonBuilder,
  ComponentType,
  ButtonStyle,
  EmbedBuilder,
  ChatInputCommandInteraction,
  CacheType,
  ColorResolvable,
} from "discord.js";

export function progressString(
  current: number,
  total: number,
  length: number = 10,
) {
  const loaded = Math.round((current / total) * length);

  let progress = "";

  for (let i = 0; i < length; i++) {
    progress += loaded > i ? "█" : "░";
  }

  return progress;
}

export function getEmbedPages(
  title: string,
  items: string[],
  options?: {
    chunkSize?: number;
    numbered?: boolean;
  },
): EmbedBuilder[] {
  const batches: string[][] = [];

  const batchSize = options?.chunkSize ?? 10;
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  const pages: EmbedBuilder[] = [];
  for (const [i, batch] of batches.entries()) {
    const start = i * batchSize;

    const description = options?.numbered
      ? batch.map((item, i) => `${start + i + 1}. ${item}`).join("\n")
      : batch.join("\n");

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setFooter({
        text: `Page ${i + 1} of ${batches.length}  • Total: ${items.length}`,
      });
    pages.push(embed);
  }

  return pages;
}

export function getPageActionRow(page: number, totalPages: number) {
  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("prev_page")
      .setLabel("Previous")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page === 0),

    new ButtonBuilder()
      .setCustomId("next_page")
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(page == totalPages - 1),
  );
  return actionRow;
}

export async function replyPagedEmbeds(
  interaction: ChatInputCommandInteraction<CacheType>,
  pages: EmbedBuilder[],
  options?: {
    timer: number;
  },
) {
  let currentPage = 0;

  const response = await interaction.reply({
    embeds: [pages[currentPage] as EmbedBuilder],
    components: [getPageActionRow(currentPage, pages.length)],
  });

  // Collector active for 5 minutes
  const collector = response.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: options?.timer ?? 60_000 * 5,
  });

  collector.on("collect", async (i) => {
    // Only the user can change pages
    if (i.user.id !== interaction.user.id) {
      return i.reply({
        content: "You cannot control these pages!",
        ephemeral: true,
      });
    }

    if (i.customId === "prev_page") {
      currentPage--;
    } else if (i.customId === "next_page") {
      currentPage++;
    }

    await i.update({
      embeds: [pages[currentPage] as EmbedBuilder],
      components: [getPageActionRow(currentPage, pages.length)],
    });
  });

  // Cleanup when timer expires
  collector.on("end", async () => {
    const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("prev_page")
        .setLabel("Previous")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("next_page")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    );

    await interaction
      .editReply({
        components: [disabledRow],
      })
      .catch(() => null);
  });
}
