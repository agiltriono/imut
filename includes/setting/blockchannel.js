const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { database, clear, embeds, remove, color } = require(".././../util/util");
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const member = interaction.guild.members.cache.get(interaction.user.id)
  const regex = /^<#[0-9]*>$/;
  const selected = interaction.values
  const description = interaction.message.embeds[0].description.trim()
  const current = description.includes("Tidak ada channel") ? [] : description.split(",").map(c=> c.trim().replace(regex, ""))
  const pre_merged = current.length != 0 ? [...new Set([...current,...selected]) : [...selected]
  const merged = [...pre_merged].filter(id => !current.includes(id))
  const ch = await guild.channels.cache.filter(c=>c.type === "GUILD_TEXT")
  const option = ch.map(c => {
    return {
      label: c.name,
      value: c.id.toString(),
      emoji: merged.includes(c.id.toString()) ? "❌" : "☑️",
      description: merged.includes(c.id.toString()) ? "Hapus channel dari daftar" : "Tambahkan channel ke daftar"
    }
  })
  var button = [{
    type: 1,
    components: [
      new MessageButton().setCustomId('setting_button_close_'+userId).setEmoji("❌").setLabel("Tutup").setStyle('DANGER')
    ]
  }]
  const simple = [
    new MessageActionRow().addComponents(new MessageSelectMenu()
      .setCustomId(`setting_selectmenu_blockchannel_${userId}_1`)
      .setPlaceholder(`Pilih Channel 1`)
      .addOptions(option))
    ]
  const menu = option.length > 25 ? await chunk(option, 25, userId) : simple
  await db.child(guild.id).update({bc:merged.toString()})
  await interaction.update({
    embeds: [{
      title: "BLOCKED CHANNEL",
      description: merged.map(c=> `<#${c}>`).toString()
    }],
    components: [].concat(button, menu)
  })
}
async function chunk(obj, i, userId) {
  let chunks = [];
  let count = 0
  while(obj.length){
    count++;
    chunks.push(new MessageActionRow().addComponents(new MessageSelectMenu()
    .setCustomId(`setting_selectmenu_blockchannel_${userId}_${count}`)
    .setPlaceholder(`Pilih Channel ${count}`)
    .addOptions(obj.splice(0,i))));
  }
  return chunks;
}