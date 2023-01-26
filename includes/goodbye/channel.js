const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { database, color } = require(".././../util/util");
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const member = interaction.guild.members.cache.get(interaction.user.id)
  if (interaction.customId.includes("goodbye_selectmenu_")) {
    const value = interaction.values[0]
    await db.child(guild.id).child("gb").update({ channel : value })
    await interaction.update({embeds:[{description: `✅ Channel di set ke <#${value}>`}],components:[]})
  } else {
    await interaction.deferReply({ephemeral:true})
    const channel = await interaction.guild.channels.cache.filter(c=>c.type === "GUILD_TEXT")
    var option = channel.map(c => {
        return {
        label: c.name,
        value: c.id.toString()
      }
    })
    if (option.length > 25) {
      const menu = await chunk(option, 25, userId);
      const custom = {
        embeds: [{
          color: color(),
          description: `**Pilih Channel**`
        }],
        components: menu,
        ephemeral: true
      }
      await interaction.editReply(custom)
    } else {
      const menu = new MessageActionRow().addComponents(new MessageSelectMenu()
        .setCustomId("goodbye_selectmenu_channel_"+userId+"_1")
        .setPlaceholder(`Channel 1`)
        .addOptions(option));
      const custom = {
        embeds: [{
          color: color(),
          description: `**Pilih Channel**`
        }],
        components: [menu],
        ephemeral: true
      }
      await interaction.editReply(custom)
    }
  }
}
async function chunk(obj, i, userId) {
  let chunks = [];
  let count = 0
  while(obj.length){
    count++;
    chunks.push(new MessageActionRow().addComponents(new MessageSelectMenu()
    .setCustomId(`goodbye_selectmenu_channel_${userId}_${count}`)
    .setPlaceholder(`Channel ${count}`)
    .addOptions(obj.splice(0,i))));
  }
  return chunks;
}