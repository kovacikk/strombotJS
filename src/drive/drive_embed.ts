import {
  EmbedBuilder,
  ColorResolvable,
  ChatInputCommandInteraction,
  CacheType,
} from "discord.js"; // Adjust import based on your framework
import { progressString } from "../commands/helpers";

export type driveItem = {
  name: string; // Bulborb
  downloading: number; // 20
  downloaded: number; // 10
  duplicates: number; // 1
  cursor?: string; // Angry Bulborb
};

export enum driveState {
  Start = "start",
  Downloading = "downloading",
  Complete = "complete",
}

export class DriveEmbedManager {
  private state: driveState;
  private currentItem: driveItem | undefined;
  private completedItems: driveItem[];

  private interaction: ChatInputCommandInteraction<CacheType>;

  private lastUiUpdateTime: number = 0;
  private readonly cooldownMs: number = 1_000;

  constructor(
    interaction: ChatInputCommandInteraction<CacheType>,
    initialState: driveState,
    currentItem?: driveItem,
    completedItems: driveItem[] = [],
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

  /**
   * Updates the current operational state of the drive manager
   */
  public setState(state: driveState): this {
    this.state = state;
    return this;
  }

  /**
   * Updates the item currently being processed (or clears it)
   */
  public setCurrentItem(item: driveItem | undefined): this {
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

  /**
   * Pushes the current item to the completed list and clears the current item active track
   */
  public completeCurrentItem(nextItem?: driveItem): this {
    if (this.currentItem) {
      this.completedItems.push(this.currentItem);
    }
    this.currentItem = nextItem;
    return this;
  }

  /**
   * Generates the visual layout map and configurations for the state
   */
  private getMetadata(): { title: string; color: ColorResolvable } {
    switch (this.state) {
      case driveState.Start:
        return { title: "Checking Drive", color: "Default" };
      case driveState.Downloading:
        // Fallback title if currentItem hasn't been set yet during download phase
        const name = this.currentItem ? `${this.currentItem.name}s` : "Files";
        return { title: `Downloading ${name}`, color: "Yellow" };
      case driveState.Complete:
        return { title: "Download Complete", color: "Green" };
      default:
        return { title: "Unknown State", color: "Default" };
    }
  }

  /**
   * Compiles the internal state into a structured Discord Embed
   */
  public build(): EmbedBuilder {
    const { title, color } = this.getMetadata();

    // Build descriptive string array for completed items
    const descriptions = this.completedItems.map((item) => {
      const plural = item.downloaded > 1 ? "s" : "";
      const nameLower = item.name.toLowerCase();

      let description = `**${item.name}s**`;

      description +=
        item.downloaded > 0
          ? `\n${item.downloaded} new ${nameLower}${plural} downloaded`
          : `\nNo ${nameLower}s to download`;

      if (item.duplicates > 0) {
        description += `\n${item.duplicates} existing ${nameLower}${plural} ignored`;
      }

      return description;
    });

    // Only append downloading data if we are actively downloading AND an item exists
    if (this.state === driveState.Downloading && this.currentItem) {
      let description = `**${this.currentItem.name}s**`;

      description += `\nCurrently downloading *${this.currentItem.cursor}*`;
      description += `\n\n${progressString(this.currentItem.downloaded, this.currentItem.downloading, 25)}`;

      descriptions.push(description);
    } else if (this.state === driveState.Downloading && !this.currentItem) {
      // Optional placeholder string for the in-between stage transition
      descriptions.push(`*Preparing next category...*`);
    }

    let description = descriptions.join("\n\n");
    if (description == "") {
      description = "...";
    }

    return new EmbedBuilder()
      .setTitle(title)
      .setDescription(description) // Clean spacing between block groups
      .setColor(color);
  }
}
