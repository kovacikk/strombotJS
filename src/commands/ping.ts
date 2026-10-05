import type { DiscordCommand } from './shared_types.ts';


const Ping: DiscordCommand = {
    name: 'ping',
    description: 'Test ping command',
    execute: (interaction) => {
        interaction.reply('Pong!');
    },
}

export default Ping;