const { database, PREFIX, fdb, clear, embeds, remove } = require(".././../util/util");
const db = database.ref("guild");
module.exports.help = {
    name: "prefix",
    aliases: ["px"],
    usage:"name",
    category: "Setting",
    permissions: ["ADMINISTRATOR","MANAGE_GUILD"],
    description: "Set prefix bot"
}

module.exports.run = async (msg, args, creator, prefix) => {
  await msg.delete()
  if (!msg.member.permissions.has("ADMINISTRATOR") || !msg.member.permissions.has("MANAGE_GUILD") || creator.id != msg.guild.ownerId) return;
  if (!msg.guild.me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
  if(args.length === 0) return msg.channel.send(embeds(`Salah Perintah kak.\n**Cara Ganti prefix** \`${prefix}prefix is!\``)).then(m=> clear(m, 2000));
  db.child(msg.guild.id).update({
   "prefix": args[0]
  });
  await msg.channel.send(embeds(`Prefix Di ubah ke \`${args[0]}\``)).then(m=>clear(m, 5000))
};