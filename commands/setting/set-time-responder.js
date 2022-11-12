const { database, PREFIX, clear, embeds, remove } = require(".././../util/util");
const db = database.ref("guild");
module.exports.help = {
    name: "set-time-responder",
    aliases: ["set-tr"],
    usage:"name",
    category: "Setting",
    permissions: ["SEND_MESSAGES"],
    description: "Set Time Responder channel untuk merespon semua chat yang berisikan Pagi, Siang, Sore, Malam, dsb."
}

module.exports.run = async (msg, args, creator, prefix) => {
  await msg.delete()
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
    if (channel.type != "GUILD_TEXT") return msg.channel.send(embeds("❌ Channel bukan *Text Channel*"));
    await db.child(msg.guild.id).update({tr:channel.id})
    await msg.channel.send(embeds(`✅ Greeting channel berhasil di setel ke <#${channel.id}>`))
  } else if (args[0] != undefined && args[0].toLowerCase() === "help") {
    await msg.channel.send(embeds(`🛠 **Setup Time Responder**\n\`${prefix}set-tr ID_CHANNEL\``));
  } else {
    await msg.channel.send(embeds(`❌ **Salah perintah**\nTry It : \`${prefix}set-tr help\``))
  }
};