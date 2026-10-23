import { EmbedBuilder, GuildMember, User } from "discord.js";
import { User as UserEntity } from "../../data/entities/User";

export async function buildStats(
  user: User | GuildMember,
  dbUser: UserEntity,
): Promise<EmbedBuilder> {
  const filteredStats: [string, number][] = Object.entries(dbUser.stats).filter(
    ([key]) => !["user", "userId"].includes(key),
  );

  const generalStats = "**General Stats:**\n" + `cancelled: ${dbUser.cancels}`;

  const commandUsage =
    "**Command Usage:**\n" +
    filteredStats
      .map(([stat, count]) => `${stat}: ${count}`)
      .sort(([keyA], [keyB]) => {
        if (!keyA || !keyB) return 0;
        return keyA.localeCompare(keyB);
      })
      .join("\n");

  const descriptions = [generalStats, commandUsage];

  const embed = new EmbedBuilder()
    .setTitle(`${user.displayName} Stats`)
    .setDescription(descriptions.join("\n\n"))
    .setThumbnail(user.displayAvatarURL());

  return embed;
}
