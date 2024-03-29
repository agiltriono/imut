const fs = require("fs");
const path = require("path");
const { Client, Intents, Collection } = require("discord.js");
const Discord = require("discord.js");
const database = require("./util/database");
const { DISCORD_TOKEN, numformat, timeconvert, clear, embeds, genId, PREFIX } = require("./util/util");
const client = new Client({ intents : [
  "GUILDS",
  "GUILD_BANS",
  "GUILD_MEMBERS",
  "GUILD_PRESENCES",
  "GUILD_MESSAGES",
  "GUILD_MESSAGE_TYPING",
  "GUILD_MESSAGE_REACTIONS",
  "DIRECT_MESSAGES",
  "DIRECT_MESSAGE_REACTIONS",
  "DIRECT_MESSAGE_TYPING",
  "MESSAGE_CONTENT",
  "GUILD_WEBHOOKS",
  "GUILD_EMOJIS_AND_STICKERS",
  "GUILD_VOICE_STATES"
  ],
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
client.discord = Discord;
client.genId = genId;
client.numformat = numformat;
client.timeconvert = timeconvert;
client.db = database;
client.prefix = PREFIX;
client.commands = new client.discord.Collection();
client.aliases = new client.discord.Collection();
client.login(DISCORD_TOKEN);

const eventFiles = fs.readdirSync('./event').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./event/${file}`);
	client.on(event.name, (...args) => event.execute(...args, client));
}

// Logging
client.on("warn", (info) => console.log(info));

client.on("error", (error) =>  console.error(error));

// node process Event
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
