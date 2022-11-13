const { database, clear, embeds } = require(".././../util/util");
const db = database.ref("guild");
module.exports.help = {
    name: "vc-allow-link",
    aliases: ["vc-link"],
    usage:"name",
    category: "Setting",
    permissions: ["SEND_MESSAGES"],
    description: "Buat daftar url yang di izinkan pada Voice Chat."
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
  if (args[0] != undefined && args[0].toLowerCase() === "list") {
    db.child(guild.id).once("value", async (s) =>{
      const src = s.child("voice").child("allow_link")
      const list = src.exists() ? src.val().trim().split(",") : []
      if (list.length === 0) return await msg.channel.send(embeds(`⚠️ Daftar kosong!`));
      await msg.channel.send(embeds(`**__LIST URL__**\n\`${list.join(",")}\``))
    })
  } else if (args[0] != undefined && args[0].toLowerCase() === "add") {
    // add
    if (args[1] === undefined) return await msg.channel.send(embeds(`❌ **Salah perintah**\nTry It : \`${prefix}vc-link help\``));
    let link = args[1].toLowerCase().trim()
    db.child(guild.id).once("value", async (s) =>{
      const src = s.child("voice").child("allow_link")
      const list = src.exists() ? src.val().trim().split(",") : []
      if (list.includes(link)) return await msg.channel.send(embeds(`⚠️ **${link}** sudah ada di dalam daftar.\n\nDaftar Saat ini :\n${list.join(",")}`));
      list.push(link)
      await db.child(msg.guild.id).child("voice").update({allow_link:list.toString()})
      await msg.channel.send(embeds(`✅ Daftar di update.\n🆕 ${link}`))
    })
  } else if(args[0] != undefined && args[0].toLowerCase() === "del") {
    // delete
    if (args[1] === undefined) return await msg.channel.send(embeds(`❌ **Salah perintah**\nTry It : \`${prefix}vc-link help\``));
    let link = args[1].toLowerCase().trim()
    db.child(guild.id).once("value", async (s) =>{
      const src = s.child("voice").child("allow_link")
      const list = src.exists() ? src.val().trim().split(",") : []
      if (list.length === 0) return await msg.channel.send(embeds(`⚠️ Daftar kosong, Tambahkan link baru ke daftar terlebih dahulu.`));
      if (!list.includes(link)) return await msg.channel.send(embeds(`⚠️ **${link}** Tidak ada pada daftar!`));
      let newList = list.filter(l=> !l.includes(link))
      await db.child(msg.guild.id).child("voice").update({allow_link:newList.toString()})
      await msg.channel.send(embeds(`✅ Daftar di update.\n❌ ${link}`))
    })
  } else if (args[0] != undefined && args[0].toLowerCase() === "help") {
    await msg.channel.send(embeds(`🛠 **__Allow Link On VC__**\n\nTambah Link ke daftar :\n \`${prefix}vc-link add youtube.com\`\nHapus Link Dari Daftar :\n \`${prefix}vc-link del youtube.com\`\n\n*NOTE: Link yang tidak ada pada daftar akan segera di hapus.*`));
  } else {
    await msg.channel.send(embeds(`❌ **Salah perintah**\nTry It : \`${prefix}vc-link help\``))
  }
};