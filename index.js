import { Client, IntentsBitField, ContextMenuCommandBuilder, ApplicationCommandType, Events } from 'discord.js';
import { geminiTranslation } from './translate.js';
import 'dotenv/config';

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages]
});

const data = new ContextMenuCommandBuilder().setName('User Information').setType(ApplicationCommandType.User);

client.login(process.env.DISCORD_TOKEN);

client.on(Events.ClientReady, () => {
    console.log("The Bot is Ready :)");
    client.user.setActivity("goyangyibot.samlee.ch");
});

client.on(Events.GuildCreate, guild => {
    client.channels.cache.get("1431622444019613696").send(guild.name + " with " + guild.memberCount + " members added 🐱");
});

client.on(Events.GuildDelete, guild => {
    client.channels.cache.get("1431622444019613696").send("Noo.. " + guild.name + " removed us..");
});

const emojiList = {
    "🥺": ["괜찮아 딩딩딩딩..", "괜찮아 🥺"],
    "😂": ["푸하하", "ㅋㅋㅋ", "ㅋㅋ", "ㅎㅎ"]
};

client.on(Events.MessageCreate, message => {
    if (message.author.bot) return;

    const words = message.content.toLowerCase().replace(/[^a-zA-Z ]/g, "").split(" ");

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

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isMessageContextMenuCommand()) return;

    if (interaction.commandName === 'Translate') {
        const targetMessage = interaction.targetMessage;
        await interaction.deferReply();
        const response = await geminiTranslation(targetMessage.content);
        const data = JSON.parse(response.trim().replace(/^```json\s*|\s*```$/g, ""));

        interaction.followUp(`
"${targetMessage}" translates to:
**${data.translation}**

✨ **Keywords:**\n
${data.keywords
    .map(k => `- **${k.word}**: ${k.meaning}`)
    .join("\n")}

💡 **Grammar Points:**\n
${data.grammar_points
    .map(g => `- **${g.title}** — ${g.explanation}`)
    .join("\n")}
`);
    }
});