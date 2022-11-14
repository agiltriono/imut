const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { database, color } = require(".././../util/util");
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const member = interaction.guild.members.cache.get(interaction.user.id)
  const ruleId = args[2]
  if (interaction.customId.includes("modlink_selectmenu_")) {
    db.child(guild.id).once("value", async (s) => {
      const modlink = [...s.child("modlink").val()]
      const selected = [...interaction.values]
      if(selected.includes("tutup")) return interaction.message.delete();
      const message = interaction.message
      const description = message.embeds[0].description.trim()
      const current = description.includes("Tidak ada channel") ? [] : description.split(",").map(c=> c.replace(/[\\<>@#&!]/g, ""))
      const ch = guild.channels.cache.filter(c=>c.type === "GUILD_TEXT")
      // merge current channel
      const final = current.length != 0 ? [...new Set([...current.filter(id=> !selected.includes(id)),...selected.filter(id=>!current.includes(id))])] : [...selected]
      // remove deleted channel
      const merged = ch.filter(c => c.id && final.includes(c.id)).map(c=>c.id)
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
            .setCustomId(`modlink_selectmenu_channel_${userId}_${ruleId}_1`)
            .setPlaceholder(`Daftar Channel 1`)
            .setMinValues(1)
    	      .setMaxValues(option.length)
            .addOptions(option))
        ]
      }
      const menu = option.length > 25 ? await chunk(option, 25, userId, ruleId) : simple()
      if (merged.length == 0) modlink[modlink.findIndex(c => c.id == ruleId)].channel = "";
      if (merged.length > 0) modlink[modlink.findIndex(c => c.id == ruleId)].channel = merged.toString();
      await db.child(guild.id).update({modlink:modlink});
      await interaction.update({
        embeds: [{
          color: color(),
          title: "TARGET CHANNEL",
          description: merged.length != 0 ? merged.map(c=> `<#${c}>`).toString() : "Tidak ada channel"
        }],
        components: menu
      })
    })
  } else {
    await interaction.deferReply()
    db.child(guild.id).once("value", async (s)=> {
      const modlink = [...s.child("modlink").val()]
      const command = modlink[modlink.findIndex(c=>c.id === ruleId)]
      const ch = command.channel.trim().length != 0 ? command.channel.trim().split(",") : []
      const list = function () {
        return ch.length != 0 ? ch.map(c=> `<#${c}>`).join(",") : "Tidak ada channel"
      }
      const channels = await guild.channels.cache.filter(c=>c.type === "GUILD_TEXT")
      const tutup = [{
        label: "TUTUP PENGATURAN",
        value: "tutup",
        emoji: "❎",
        description: "Pilih ini untuk menutup pengaturan."
      }]
      const array = channels.map(c => {
        return {
          label: c.name,
          value: c.id.toString(),
          emoji: ch.includes(c.id.toString()) ? "❌" : "☑️",
          description: ch.includes(c.id.toString()) ? "Hapus channel dari daftar" : "Tambahkan channel ke daftar",
        }
      })
      const option = [].concat(tutup,array)
      const simple = function () { 
        return [
          new MessageActionRow().addComponents(new MessageSelectMenu()
            .setCustomId(`modlink_selectmenu_channel_${userId}_${ruleId}_1`)
            .setPlaceholder(`Pilih Channel 1`)
            .setMinValues(1)
    	      .setMaxValues(option.length)
            .addOptions(option))
        ]
      }
      const menu = option.length > 25 ? await chunk(option, 25, userId, ruleId) : simple()
      await interaction.editReply({
        embeds: [{
          color: color(),
          title: "TARGET CHANNEL",
          description: list()
        }],
        components: menu
      })
    })
  }
}
async function chunk(obj, i, userId, ruleId) {
  let chunks = [];
  let count = 0
  while(obj.length){
    count++;
    const arr = obj.splice(0,i)
    chunks.push(new MessageActionRow().addComponents(new MessageSelectMenu()
    .setCustomId(`modlink_selectmenu_channel_${userId}_${ruleId}_${count}`)
    .setPlaceholder(`Pilih Channel ${count}`)
    .setMinValues(1)
	  .setMaxValues(arr.length)
    .addOptions(arr)));
  }
  return chunks;
}