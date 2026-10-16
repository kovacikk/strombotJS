import { User } from "discord.js";
import { DiscordCommand } from "../types";
import { getOrCreateUser, incrementCommandStat } from "../data/data_controller";

export async function logCommand(
  user: User,
  command: DiscordCommand,
): Promise<void> {
  const userEntry = await getOrCreateUser(user.id);

  // Increase command count in user
  if (userEntry) {
    await incrementCommandStat(userEntry, command.name);
  }
}
