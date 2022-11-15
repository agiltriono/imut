//1042080292124499978
const { database, clear, embeds } = require(".././../util/util");
const db = database.ref("guild");
module.exports.help = {
    name: "message",
    aliases: ["msg"],
    usage:"",
    category: "Developer",
    permissions: ["SEND_MESSAGES"],
    description: "Message info, Sender, etc."
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
  const rgx = /^[a-zA-Z]+$/
  const guild = msg.guild
  if (args[0] != undefined && args[0].toLowerCase() === "info") {
    let c = [...args]
    c.shift()
    if(c.length === 0) return msg.channel.send(embeds("⚠️ Argument must be valid string."));
    let m = [...c]
    m.shift()
    let channel = msg.guild.channels.cache.get(c[0])
    if (!channel) return msg.channel.send(embeds("⚠️ ERROR : Mention Channel untuk send message"));
    const message = await channel.messages.fetch(m[0])
    if (!message) return msg.channel.send(embeds("⚠️ ERROR : Message undefined"));
    await msg.channel.send(embeds(`ID : ${message.id}\nTYPE :\n${message.type}\nCONTENT : ${message.content}`))
    console.log(message)
  }
};