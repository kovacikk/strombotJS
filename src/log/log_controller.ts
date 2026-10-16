import { User } from "discord.js";
import { DiscordCommand } from "../types";
import {
  getUser,
  createUser,
  incrementCommandStat,
} from "../data/data_controller";
import { User as UserEntity } from "../data/entities/User";

export async function logCommand(
  user: User,
  command: DiscordCommand,
): Promise<void> {
  let userEntry = await getUser(user.id);

  // Add user to user database if not present
  if (!userEntry) {
    const userPayload = {
      id: user.id,
      stats: {},
    } as UserEntity;

    userEntry = await createUser(userPayload);
  }

  // Increase command count in user
  if (userEntry) {
    await incrementCommandStat(userEntry, command.name);
  }
}
