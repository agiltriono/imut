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
  if (!msg.member.permissions.has("ADMINISTRATOR") || !msg.member.permissions.has("MANAGE_GUILD") || creator.id != msg.guild.ownerId) return;
  if (!msg.guild.me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
  
  const ch = /^[0-9]*$/;
  if (ch.test(args[0])) {
    let channelId = args[0].replace(/ +/g, '')
    let channel = msg.guild.channels.cache.get(channelId)
    if(!channel) return msg.channel.send(embeds("❌ Channel tidak ditemukan!"));
    if (channel.type != "GUILD_VOICE") return msg.channel.send(embeds("❌ Channel bukan *Voice Channel*"));
    await db.child(msg.guild.id).child("voice").update({creator:channel.id})
    channel.permissionOverwrites.cache.forEach(async (c)=> {
      if (c.type === "role") await 
      c.permissionOverwrites.edit(c.id, {
        "SEND_MESSAGES": false,
        "READ_MESSAGE_HISTORY": false
      })
    })
    await msg.channel.send(embeds(`✅ Creator channel berhasil di setel ke ${channel.name}.`))
  } else if (args[0] != undefined && args[0].toLowerCase() === "help") {
    await msg.channel.send(embeds(`🛠 **Setup Creator**\n\`${prefix}setup-creator ID_CHANNEL\``));
  } else {
    await msg.channel.send(embeds(`❌ **Salah perintah**\nTry It : \`${prefix}setup-creator help\``))
  }
}