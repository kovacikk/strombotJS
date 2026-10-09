import type { DiscordCron } from '../types.js';
import { TextChannel } from 'discord.js';

const TEST_CHANNEL_ID = process.env.TEST_CHANNEL_ID ?? '';

const TestPing: DiscordCron = {
    name: 'testPing',
    pattern: '* * * * *',
    execute: async (client) => {
        let channel = await client.channels.cache.get(TEST_CHANNEL_ID) as TextChannel;
        if (!channel) {
            channel = await client.channels.fetch(TEST_CHANNEL_ID) as TextChannel;
        }
        if (channel) {
            await channel.send('Test cron fired!');
        }
    },
}

export default TestPing;