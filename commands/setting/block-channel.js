const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { database, PREFIX, fdb, clear, embeds, remove } = require(".././../util/util");
const db = database.ref("guild");
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
  if (!msg.member.permissions.has("ADMINISTRATOR") || !msg.member.permissions.has("MANAGE_GUILD") || creator.id != msg.guild.ownerId) return;
  if (!msg.guild.me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
  const guild = msg.guild
  db.child(guild.id).once("value", async (s) => {
    try {
    const allowed = s.child("bc")
    const block = allowed.exists() ? allowed.val().split(",") : []
    const list = function () {
      return block.length != 0 ? block.map(c=> `<#${c}>`).join(",") : "Tidak ada channel"
    }
    const ch = await guild.channels.cache.filter(c=>c.type === "GUILD_TEXT")
    const option = ch.map(c => {
      return {
        label: c.name,
        value: c.id.toString(),
        emoji: block.includes(c.id.toString()) ? "❌" : "☑️",
        description: block.includes(c.id.toString()) ? "Hapus channel dari daftar" : "Tambahkan channel ke daftar",
      }
    })
    var button = [{
      type: 1,
      components: [
        new MessageButton().setCustomId('setting_button_close_'+creator.id).setEmoji("❌").setLabel("Tutup").setStyle('DANGER')
      ]
    }]
    const simple = [
      new MessageActionRow().addComponents(new MessageSelectMenu()
        .setCustomId(`setting_selectmenu_blockchannel_${count}`)
        .setPlaceholder(`Daftar Channel ${count}`)
        .addOptions(option))
      ]
    const menu = option.length > 25 ? await chunk(option, 25) : simple
    await msg.channel.send({
      embeds: [{
        title: "BLOCKED CHANNEL",
        description: list()
      }],
      components: [].concat(button, menu)
    })
    } catch (error) {
      msg.channel.send(error.message)
    }
  })
}
async function chunk(obj, i) {
  let chunks = [];
  let count = 0
  while(obj.length){
    count++;
    chunks.push(new MessageActionRow().addComponents(new MessageSelectMenu()
    .setCustomId(`setting_selectmenu_blockchannel_${count}`)
    .setPlaceholder(`Daftar Channel ${count}`)
    .addOptions(obj.splice(0,i))));
  }
  return chunks;
}
/*
      const value = i.values
      const newArray = [...new Set([...isAllowed,...value])]
*/