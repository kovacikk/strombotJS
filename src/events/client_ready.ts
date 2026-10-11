import type { DiscordEvent } from "../types.js";
import { Client, Events } from "discord.js";
import nodeCron from "node-cron";

import allCrons from "../crons/index.js";

const ClientReady: DiscordEvent = {
  name: Events.ClientReady,
  once: true,
  execute: (client: Client) => {
    if (!client || !client.user) return;
    console.log(`Strombot started. Logged in as ${client.user.tag}`);

    // Load Crons
    for (const cron of allCrons) {
      nodeCron.schedule(
        cron.pattern,
        () => {
          console.log(`Running cron ${cron.name}`);
          try {
            cron.execute(client);
          } catch (error) {
            console.log(`Failed to run cron ${cron.name}`, error);
          }
        },
        {
          timezone: "America/New_York",
        },
      );
    }
  },
};

export default ClientReady;
