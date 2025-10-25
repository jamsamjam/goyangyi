import { Client, IntentsBitField } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages]
});

client.on("clientReady", () => {
    console.log("The Bot is Ready :)");
    client.user.setActivity("goyangyibot.samlee.ch");
});

client.login(process.env.DISCORD_TOKEN);

const emojiList = {
    "🥺": ["괜찮아 딩딩딩딩..", "괜찮아 🥺"],
    "😂": ["푸하하", "ㅋㅋㅋ", "ㅋㅋ", "ㅎㅎ"]
};

client.on("messageCreate", message => {
    if (message.author.bot) return;

    if (message.content.includes("cat")) {
        // send message 냐옹
        message.channel.send("**냐옹냐옹** 😺");
    }

    const supportedEmojis = Object.keys(emojiList);

    supportedEmojis.forEach(emoji => {
        const replies = emojiList[emoji]
        const prob = Math.random();
        const occurence = Math.random();

        const sentMessage = replies[Math.floor(prob * replies.length)];
        if (message.content.includes(emoji) && occurence >= .5) {
            message.reply(sentMessage);
        }
    });
});