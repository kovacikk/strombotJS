
import * as dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits } from 'discord.js';
import allEvents from './events/index.js';

const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? '';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Initialze all events
for (const event of allEvents) {
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(DISCORD_TOKEN);