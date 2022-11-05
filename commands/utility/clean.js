const { embeds, clear } = require(".././../util/util");

module.exports.help = {
  name: "clean",
  aliases: ["cl"],
  cooldown: 3,
  usage: "<5-100 | all>",
  category: "Utility",
  permissions: ["MANAGE_MESSAGES","ADMINISTRATOR"],
  description: "Hapus beberapa atau seluruh pesan dalam channel."
}
module.exports.run = async (msg, args, creator, client, prefix) => {
  await clear(msg, 1000)
  const permis = [
    (msg.member.permissions.has("ADMINISTRATOR")),
    (msg.member.permissions.has("MANAGE_GUILD")),
    (creator.id === msg.guild.ownerId)
  ].filter(u=>u.toString() != "false")
  if(permis.length === 0) return;
  if (!msg.guild.me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
  if (!args.length) return msg.channel.send(embeds(`❌  Masukan di butuhkan!\n**Contoh: ${prefix}${clean} 1-100|all**`)).then(m => clear(m, 2000))
  const number = /^[1-9][0-9]?$|^100$/;
  const character = /[a-zA-Z]+/;
  const message = await msg.channel.messages.fetch()
  if (args[0].toLowerCase() === "all") {
    if (message.size == 0) return msg.channel.send(embeds("❌ Gak ada chat untuk di hapus!")).then(m=>clear(m,3000));
    return msg.channel.send({embeds:[{
      color: "#ff6961",
      title: "PERINGATAN PENGHAPUSAN MASAL",
      description: `**Pembersihan dimulai setelah ⏰10 detik.**`
    }]}).then(async m => {
      await clear(m, 10000)
      return purge(msg, "all", 0, Date.now())
    })
  } else if (number.test(args[0])) {
    if (message.size == 0) return msg.channel.send(embeds("❌ Gak ada chat untuk di hapus!")).then(m=>clear(m,3000));
    return purge(msg, parseInt(args[0]), 0, Date.now())
  } else {
    return msg.channel.send(`❌ Perintah salah, coba ${prefix}${clean} **1-100**`).then(m => clear(m, 3000))
  }
}
async function purge (msg, amount, removed, startdate) {
  const start = startdate || Date.now()
  const message = await msg.channel.messages.fetch();
  let progress = 0
  for(let i = 0; i < message.size;i++) {
    progress++;
    await message.at(i).delete()
    if (amount != "all") {
      if (amount == progress) {
        let ended = (Date.now() - start)
        msg.channel.send(embeds(`:white_check_mark: **${(removed)+progress}** pesan dihapus dalam ⏱️${ended.toFixed(1)}ms`)).then(m => clear(m, 3000))
        break;
      } else if (message.size === progress) {
          recursive(msg, amount, (removed)+progress, start)
          break;
      }
    }
    if (amount === "all" && message.size === progress) {
        recursive(msg, amount, (removed)+progress, start)
        break;
    }
  }
}
async function recursive(msg, amount, removed, start) {
  const message = await msg.channel.messages.fetch()
  if (message.size === 0) {
    let ended = (Date.now() - start)
    msg.channel.send(embeds(`:white_check_mark: **${removed}** pesan dihapus dalam ⏱️${ended.toFixed(1)}ms`)).then(m => clear(m, 3000))
  } else {
    purge(msg, amount, removed, start)
  }
}