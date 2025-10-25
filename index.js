import { Client, IntentsBitField, messageLink } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages]
});

client.login(process.env.DISCORD_TOKEN);

client.on("clientReady", () => {
    console.log("The Bot is Ready :)");
    client.user.setActivity("goyangyibot.samlee.ch");
});

client.on("guildCreate", guild => {
    client.channels.cache.get("1431622444019613696").send(guild.name + " with " + guild.approximateMemberCount + " members added 🐱");
});

client.on("guildDelete", guild => {
    client.channels.cache.get("1431622444019613696").send("Noo.. " + guild.name + " removed us..");
});

const emojiList = {
    "🥺": ["괜찮아 딩딩딩딩..", "괜찮아 🥺"],
    "😂": ["푸하하", "ㅋㅋㅋ", "ㅋㅋ", "ㅎㅎ"]
};

client.on("messageCreate", message => {
    if (message.author.bot) return;

    const words = message.content.replace(/[^a-zA-Z ]/g, "").split(" ");

    if (['cat', 'cats', 'kitten', 'kittens', 'kitty', 'kitties'].some(elem => words.includes(elem))) {
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