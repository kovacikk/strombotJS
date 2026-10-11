import type { DiscordCommand } from "../types.js";

const Ping: DiscordCommand = {
  name: "ping",
  description: "Test ping command",
  execute: (interaction) => {
    interaction.reply("Pong!");
  },
};

export default Ping;
