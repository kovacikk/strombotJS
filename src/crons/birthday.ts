import { getBirthdays } from "../data/data_controller";
import { User } from "../data/entities/User.js";
import type { DiscordCron } from "../types.js";
import { TextChannel, AttachmentBuilder, EmbedBuilder } from "discord.js";

//const BIGONE_CHANNEL_ID = process.env.BIGONE_CHANNEL_ID ?? "";
const TEST_CHANNEL_ID = process.env.TEST_CHANNEL_ID ?? "";

const CAKE_IMAGE_PATH = "/app/media/events/birthday/cake.jpg";

const Birthday: DiscordCron = {
  name: "birthday",
  pattern: "0 12 * * *",
  execute: async (client) => {
    let channel = (await client.channels.cache.get(
      TEST_CHANNEL_ID,
    )) as TextChannel;
    if (!channel) {
      channel = (await client.channels.fetch(TEST_CHANNEL_ID)) as TextChannel;
    }
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

  const thumbnail = new AttachmentBuilder(CAKE_IMAGE_PATH);

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
