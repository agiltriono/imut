const { embeds, clear } = require(".././../util/util"); 
const { MessageButton } = require("discord.js");
const { updateData, getPlayer } = require('.././../util/music');

module.exports.help = {
    name: "setup-player",
    aliases: ["setup-pl"],
    usage:"",
    category: "Music",
    permissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    description: "Buat channel musik khusus"
}

module.exports.run = async function(msg, args, creator, prefix) {
  await clear(msg)
  const permis = [
    (msg.member.permissions.has("ADMINISTRATOR")),
    (msg.member.permissions.has("MANAGE_GUILD")),
    (creator.id === msg.guild.ownerId)
  ].filter(u=>u.toString() != "false")
  if(permis.length === 0) return;
  // ID_CHANNEL
  if (!msg.guild.me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
  const guild = msg.guild
  // database
  
    // Check Argument & Channel
    if (!args.length) return msg.channel.send(embeds('❌ Argument tambahan di butuhkan *CHANNEL*'));
    const ch = args[0].replace(/ +/g, "").replace(/[\\<>@#&!]/gm, "");
    const channel = guild.channels.cache.get(ch)
    if (!channel) return msg.channel.send(embeds('❌ Channel tidak ditemukan, Harap tentukan ID channel / Mention Channel'));
    if (channel.type != "GUILD_TEXT") return msg.channel.send(embeds('❌ Channel harus berbentuk *Text Channel / Chat Channel*'));
         
    const player = await getPlayer(channel)
    const queueMessage = await channel.send(player.queueMessage);
    const playerMessage = await channel.send(player.playerMessage);
    
    await updateData(guild.id, {
      "music_channel": channel.id,
      "music_queue": queueMessage.id,
      "music_player": playerMessage.id
    });
    
    await msg.channel.send(embeds(`✅ Musik Player berhasil di buat di channel <#${channel.id}>`)).then(m=>clear(m, 2000));
}
