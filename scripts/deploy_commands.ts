import * as dotenv from 'dotenv';
import { REST, Routes } from 'discord.js'

import { getCommands, buildCommands } from '../src/helpers.js';

dotenv.config();
const CLIENT_ID = process.env.CLIENT_ID ?? '';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? '';

const rest = new REST().setToken(DISCORD_TOKEN);

(async () => {
    try {
        const commands = getCommands();
        const slashCommands = buildCommands(commands);

        console.log(`Started refreshing ${slashCommands.length} application (/) commands.`)

        const data: any = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: slashCommands });

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();