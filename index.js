import 'dotenv/config';
import { Client, IntentsBitField, ContextMenuCommandBuilder, ApplicationCommandType, Events } from 'discord.js';
import { geminiTranslation } from './translate.js';
import Database from "easy-json-database";

const client = new Client({
    intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages]
});

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  client.guilds.cache.forEach(guild => {
    const iconURL = guild.iconURL({ dynamic: true });
    console.log(`${guild.name}: ${iconURL || 'No icon'}`);
  });
});

client.login(process.env.DISCORD_TOKEN);

const db = new Database("./some-database.json", {
    snapshots: {
        enabled: true,
        interval: 24 * 60 * 60 * 1000,
        folder: './backups/'
    }
});
db.set('prob', 0.5);

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'probability') {
        const prob = interaction.options.get('value').value;
        db.set('prob', prob);
        interaction.reply(`Now Goyangyi replies with the probability of ${prob}.`);
    }
});

client.on(Events.ClientReady, () => {
    console.log("The Bot is Ready :)");
    client.user.setActivity("goyangyibot.samlee.ch");
});

client.on(Events.GuildCreate, guild => {
    client.channels.cache.get("1431622444019613696").send(`${guild.name} with ${guild.memberCount} members added 🐱\n ${guild.iconURL({ dynamic: true }) || "No icon"}`);
});

client.on(Events.GuildDelete, guild => {
    client.channels.cache.get("1431622444019613696").send("Noo.. " + guild.name + " removed us..");
});

const emojiList = {
    "🥺": ["괜찮아 딩딩딩딩..", "괜찮아 🥺"],
    "😂": ["푸하하", "ㅋㅋㅋ", "ㅎㅎ"],
    "😭": ["허거걱", "냥..."],
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
        const randomIndex = Math.floor(Math.random() * replies.length);
        const roll = Math.random();

        const sentMessage = replies[randomIndex];
        if (message.content.includes(emoji) && roll <= db.get('prob')) {
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