const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { clear, embeds, remove,color } = require(".././../util/util");
module.exports.help = {
    name: "blocked-channel",
    aliases: ["bc"],
    usage:"name",
    category: "Setting",
    permissions: ["ADMINISTRATOR", "SEND_MESSAGES"],
    description: "Setel channel untuk bot agar tidak dapat berinteraksi dengan member pada channel tertentu."
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
  const guild = msg.guild
  const db = await msg.client.db.get(guild.id);
  const allowed = db["bc"];
  const block = allowed ? allowed.split(",") : []
  const list = function () {
    return block.length != 0 ? block.map(c=> `<#${c}>`).join(",") : "Tidak ada channel"
  }
  const ch = await guild.channels.cache.filter(c=>c.type === "GUILD_TEXT")
  const tutup = [{
    label: "TUTUP PENGATURAN",
    value: "tutup",
    emoji: "❎",
    description: "Pilih ini untuk menutup pengaturan."
  }]
  const array = ch.map(c => {
    return {
      label: c.name,
      value: c.id.toString(),
      emoji: block.includes(c.id.toString()) ? "❌" : "☑️",
      description: block.includes(c.id.toString()) ? "Hapus channel dari daftar" : "Tambahkan channel ke daftar",
    }
  })
  const option = [].concat(tutup,array)
  const simple = function () { 
    return [
      new MessageActionRow().addComponents(new MessageSelectMenu()
        .setCustomId(`setting_selectmenu_blockchannel_${creator.id}_1`)
        .setPlaceholder(`Pilih Channel 1`)
        .setMinValues(1)
				.setMaxValues(option.length)
        .addOptions(option))
    ]
  }
  const menu = option.length > 25 ? await chunk(option, 25, creator.id) : simple()
  await msg.channel.send({
    embeds: [{
      color: color(),
      title: "BLOCKED CHANNEL",
      description: list()
    }],
    components: menu
  })
}
async function chunk(obj, i, userId) {
  let chunks = [];
  let count = 0
  while(obj.length){
    count++;
    const arr = obj.splice(0,i)
    chunks.push(new MessageActionRow().addComponents(new MessageSelectMenu()
    .setCustomId(`setting_selectmenu_blockchannel_${userId}_${count}`)
    .setPlaceholder(`Daftar Channel ${count}`)
    .setMinValues(1)
	  .setMaxValues(arr.length)
    .addOptions(arr)));
  }
  return chunks;
}