import {
  EmbedBuilder,
  ColorResolvable,
  ChatInputCommandInteraction,
  CacheType,
} from "discord.js";
import { progressString } from "../commands/helpers";

export type DriveItem = {
  name: string; // Bulborb
  downloading: number; // 20
  downloaded: number; // 10
  duplicates: number; // 1
  largeFiles: number; // 0
  cursor?: string; // Angry Bulborb
};

export enum driveState {
  Start = "start",
  Downloading = "downloading",
  Complete = "complete",
}

export class DriveEmbedManager {
  private state: driveState;
  private currentItem: DriveItem | undefined;
  private completedItems: DriveItem[];

  private interaction: ChatInputCommandInteraction<CacheType>;

  private lastUiUpdateTime: number = 0;
  private readonly cooldownMs: number = 1_000;

  constructor(
    interaction: ChatInputCommandInteraction<CacheType>,
    initialState: driveState,
    currentItem?: DriveItem,
    completedItems: DriveItem[] = [],
  ) {
    this.interaction = interaction;
    this.state = initialState;
    this.currentItem = currentItem;
    this.completedItems = completedItems;
  }

  public shouldEdit(): boolean {
    return Date.now() - this.lastUiUpdateTime > this.cooldownMs;
  }

  public async refresh(force: boolean = false): Promise<void> {
    if (force || this.shouldEdit()) {
      try {
        await this.interaction.editReply({ embeds: [this.build()] });
        this.lastUiUpdateTime = Date.now();
      } catch (error) {
        console.error("Failed to edit interaction reply", error);
      }
    }
  }

  public async finish(state: driveState): Promise<void> {
    this.setState(state);

    // Wait full cooldown to guarantee this sets
    await new Promise((resolve) => setTimeout(resolve, this.cooldownMs));
    await this.refresh();
  }

  // Set overall drive state
  public setState(state: driveState): this {
    this.state = state;
    return this;
  }

  // Updates the currently downloading item
  public setCurrentItem(item: DriveItem | undefined): this {
    this.currentItem = item;
    return this;
  }

  // Updates cursor and increments downloaded
  public updateProgress(cursor: string, increment: boolean = true): this {
    if (this.currentItem) {
      this.currentItem.cursor = cursor;
      if (increment) {
        this.currentItem.downloaded++;
      }
    }
    return this;
  }

  // Pushes the current item and queues up the next one
  public completeCurrentItem(nextItem?: DriveItem): this {
    if (this.currentItem) {
      this.completedItems.push(this.currentItem);
    }
    this.currentItem = nextItem;
    return this;
  }

  // Gets the title and color based on title
  private getMetadata(): { title: string; color: ColorResolvable } {
    switch (this.state) {
      case driveState.Start:
        return { title: "Checking Drive", color: "Default" };
      case driveState.Downloading:
        const name = this.currentItem ? `${this.currentItem.name}s` : "Files";
        return { title: `Downloading ${name}`, color: "Yellow" };
      case driveState.Complete:
        return { title: "Download Complete", color: "Green" };
      default:
        return { title: "Unknown State", color: "Default" };
    }
  }

  // Puts together the embed, generates the descriptions based on items
  public build(): EmbedBuilder {
    const { title, color } = this.getMetadata();

    const descriptions = this.completedItems.map((item) => {
      const plural = item.downloaded > 1 ? "s" : "";
      const nameLower = item.name.toLowerCase();

      let description = `**${item.name}s**`;

      description +=
        item.downloaded > 0
          ? `\n${item.downloaded} new ${nameLower}${plural} downloaded`
          : `\nNo ${nameLower}s to download`;

      if (item.duplicates > 0) {
        description += `\n${item.duplicates} ${nameLower}${plural} rejected due to duplicate name`;
      }

      if (item.largeFiles > 0) {
        description += `\n${item.largeFiles} ${nameLower}${plural} rejected due to size limits`;
      }

      return description;
    });

    if (this.state === driveState.Downloading && this.currentItem) {
      let description = `**${this.currentItem.name}s**`;

      description += `\nCurrently downloading *${this.currentItem.cursor}*`;
      description += `\n\n${progressString(this.currentItem.downloaded, this.currentItem.downloading, 25)}`;

      descriptions.push(description);
    } else if (this.state === driveState.Downloading && !this.currentItem) {
      descriptions.push(`*Preparing next category...*`);
    }

    let description = descriptions.join("\n\n");
    if (description == "") {
      description = "...";
    }

    return new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color);
  }
}
