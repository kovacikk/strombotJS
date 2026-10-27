import { getBirthdays } from "../data/data_controller";
import { User } from "../data/entities/User.js";
import type { DiscordCron } from "../types.js";
import { TextChannel, AttachmentBuilder, EmbedBuilder } from "discord.js";
import { getGeneralChannel } from "../helpers";
import { readFileSync } from "node:fs";

const CAKE_IMAGE_PATH = "/app/media/events/birthday/cake.jpg";

const Birthday: DiscordCron = {
  name: "birthday",
  pattern: "0 12 * * *",
  execute: async (client) => {
    const channel = await getGeneralChannel(client);

    if (channel) {
      const date = new Date();

      const users = await getBirthdays(date);

      for (const user of users) {
        const { embeds, files } = await buildBirthdayEmbed(user);

        const message = await channel.send({
          embeds,
          files,
        });

        await message.react("🎂");
        await message.react("🍨");
      }
    }
  },
};

async function buildBirthdayEmbed(user: User): Promise<{
  embeds: EmbedBuilder[];
  files: AttachmentBuilder[];
}> {
  const name = user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName;
  const encodedName = encodeURIComponent(name ?? "");

  const fileBuffer = readFileSync(CAKE_IMAGE_PATH);
  const thumbnail = new AttachmentBuilder(fileBuffer);

  const embed = new EmbedBuilder()
    .setTitle(`Happy Birthday ${user.firstName}!`)
    .setURL(`https://itsyourbirthday.today/#${encodedName}`)
    .setThumbnail("attachment://cake.jpg")
    .setDescription(
      `Strombot thinks it is your birthday and wishes you a happy birthday!!! Everyone wish ${name} a happy birthday!!!`,
    )
    .setColor("Green");

  return {
    embeds: [embed],
    files: [thumbnail],
  };
}

export default Birthday;
