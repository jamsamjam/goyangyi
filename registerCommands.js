import 'dotenv/config';
import { REST, Routes, SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, ApplicationCommandOptionType } from 'discord.js';

const commands = [
    new ContextMenuCommandBuilder()
        .setName('Translate')
        .setType(ApplicationCommandType.Message),

    new SlashCommandBuilder()
        .setName('hey')
        .setDescription('Replies with hey!'),

    new SlashCommandBuilder()
        .setName('emoji-probability')
        .setDescription('How often Goyangyi replies to emojis.')
        .addNumberOption(opt => 
            opt
                .setName('value')
                .setDescription('Enter a number between 0 and 1.')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(1)
        ),

    new SlashCommandBuilder()
        .setName('gif-probability')
        .setDescription('How often Goyangyi sends a meme.')
        .addNumberOption(opt => 
            opt
                .setName('value')
                .setDescription('Enter a number between 0 and 1.')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(1)
        )
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

try {
    console.log('Refreshing application commands.');

    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID), // needs to be refreshed, applicationGuildCommand also works
        { body: commands },
    )

    console.log('Successfully registered application commands.');
} catch (error) {
    console.error(error);
}