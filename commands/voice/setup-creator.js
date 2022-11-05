const { database, embeds, getmsg, clear, remove, color } = require(".././../util/util"); 
const db = database.ref("guild");
const { MessageButton } = require("discord.js");

module.exports.help = {
    name: "setup-creator",
    aliases: ["set-cc"],
    usage:"",
    category: "Auto Channel",
    permissions: ["ADMINISTRATOR"],
    description: "Set crator channel untuk member dapat membuat channel secara otomatis"
}

module.exports.run = async function(msg, args, creator, prefix) {
  await msg.delete()
  // ID_CHANNEL
  const permis = [
    (msg.member.permissions.has("ADMINISTRATOR")),
    (msg.member.permissions.has("MANAGE_GUILD")),
    (creator.id === msg.guild.ownerId)
  ].filter(u=>u.toString() != "false")
  if(permis.length === 0) return;
  if (!msg.guild.me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
  
  const ch = /^[0-9]*$/;
  if (ch.test(args[0])) {
    let channelId = args[0].replace(/ +/g, '')
    let channel = msg.guild.channels.cache.get(channelId)
    if(!channel) return msg.channel.send(embeds("❌ Channel tidak ditemukan!"));
    if (channel.type != "GUILD_VOICE") return msg.channel.send(embeds("❌ Channel bukan *Voice Channel*"));
    await db.child(msg.guild.id).child("voice").update({creator:channel.id})
    const permit = channel.permissionOverwrites.cache
    /*todo channel permission disable view message voice chat
      SEND_MESSAGES
      READ_MESSAGE_HISTORY
      ADD_REACTIONS
      ATTACH_FILES
      USE_EXTERNAL_EMOJIS
      USE_APPLICATION_COMMANDS
    */
    permit.forEach(async (c)=> {
      if (c.type === "role") await channel.permissionOverwrites.edit(c.id, {
        "SEND_MESSAGES": false,
        "READ_MESSAGE_HISTORY": false,
        "ADD_REACTIONS": false,
        "EMBED_LINKS": false,
        "ATTACH_FILES": false,
        "USE_EXTERNAL_EMOJIS": false,
        "USE_APPLICATION_COMMANDS": false,
        "SEND_TTS_MESSAGES": false
      });
    })
    await msg.channel.send(embeds(`✅ Creator channel berhasil di setel ke ${channel.name}.`))
  } else if (args[0] != undefined && args[0].toLowerCase() === "help") {
    await msg.channel.send(embeds(`🛠 **Setup Creator**\n\`${prefix}setup-creator ID_CHANNEL\``));
  } else {
    await msg.channel.send(embeds(`❌ **Salah perintah**\nTry It : \`${prefix}setup-creator help\``))
  }
}