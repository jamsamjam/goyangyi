import dotenv from 'dotenv';
import { ContextMenuCommandBuilder, ApplicationCommandType, REST, Routes } from 'discord.js';

dotenv.config();

const commandsData = [
    new ContextMenuCommandBuilder().setName('Translate').setType(ApplicationCommandType.Message),
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

try {
    console.log('Refreshing context menu commands.');

    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID), // needs to be refreshed, applicationGuildCommand also works
        { body: commandsData },
    )

    console.log('Successfully registered context menu commands.');
} catch (error) {
    console.error(error);
}