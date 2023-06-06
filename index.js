const fs = require("fs");
const path = require("path");
const { Client, Intents, Collection } = require("discord.js");
const Discord = require("discord.js");
const { Player } = require('discord-player');
const { queue, getButton, setPlayer, updatePlayer } = require('./util/music');
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
client.player = new Player(client);
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

// Music PLayer Event
client.player.on('error', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

client.player.on('connectionError', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

client.player.on('trackEnd', async (queue, track) => {
  const msg = queue.metadata;
  const q = client.player.getQueue(msg.guild.id);
  if (q.repeatMode != 0) return;
  if (!q.current || !q.tracks.length) {
    await setPlayer(client.guilds.cache.get(msg.guild.id));
    await client.user.setActivity(`discord.gg/imutserver`, { type: "WATCHING", url: "https://discord.gg/imutserver" });
  }
});

client.player.on('trackStart', async (queue, track) => {
  const msg = queue.metadata;
  await updatePlayer(client.guilds.cache.get(msg.guild.id), client)
  await client.user.setActivity(`🎶 ${track.title}`, { type: "PLAYING", url: `${track.url}` });
});

client.player.on('trackAdd', async (queue, track) => {
  const msg = queue.metadata;
  await updatePlayer(client.guilds.cache.get(msg.guild.id), client)
  
  await msg.channel.send(embeds(`🎶 **${track.title}** added!`)).then(m=>clear(m, 2000));
});

client.player.on('botDisconnect', async (queue) => {
  const msg = queue.metadata;
  const guild = msg.guild
  await queue.destroy()
  await setPlayer(client.guilds.cache.get(msg.guild.id));
  client.user.setActivity(`discord.gg/imutserver`, { type: "WATCHING", url: "https://discord.gg/imutserver" });
});

// node process Event
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});