const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { clear, embeds, remove, color } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const member = interaction.guild.members.cache.get(interaction.user.id)
  const db = await client.db.get(guild.id);
  const modlink = db.modlink;
  const message = interaction.message
  const selected = [...interaction.values]
  if(selected.includes("tutup")) return interaction.message.delete();
  const description = message.embeds[0].description.trim()
  const current = description.includes("Tidak ada channel") ? [] : description.split(",").map(c=> c.replace(/[\\<>@#&!]/g, ""))
  const merged = current.length != 0 ? [...new Set([...current.filter(id=> !selected.includes(id)),...selected.filter(id=>!current.includes(id))])] : [...selected]
  const ch = guild.channels.cache.filter(c=>c.type === "GUILD_TEXT")
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
      emoji: merged.includes(c.id.toString()) ? "❌" : "☑️",
      description: merged.includes(c.id.toString()) ? "Hapus channel dari daftar" : "Tambahkan channel ke daftar"
    }
  })
  var option = [].concat(tutup, array)
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
  const menu = option.length > 25 ? await chunk(option, 25, userId) : simple()
  
  await client.db.update(guild.id, {bc:merged.toString()});
  
  await interaction.update({
    embeds: [{
      color: color(),
      title: "BLOCKED CHANNEL",
      description: merged.length != 0 ? merged.map(c=> `<#${c}>`).toString() : "Tidak ada channel"
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
    .setPlaceholder(`Pilih Channel ${count}`)
    .setMinValues(1)
	  .setMaxValues(arr.length)
    .addOptions(arr)));
  }
  return chunks;
}