const { embeds, getmsg, clear, remove, color } = require(".././../util/util");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
module.exports = async function recreate(interaction, client, userId) {
  // ID_CHANNEL
  const guild = interaction.guild
  const db =  await client.db.get(guild.id)
  const modlink = db.modlink
  var notlimited = {
    type: 1,
    components: [
      new MessageButton().setCustomId('modlink_button_create_'+userId).setEmoji("📝").setLabel("New Rule").setStyle('PRIMARY'),
      new MessageButton().setCustomId('modlink_button_close_'+userId).setEmoji("❌").setLabel("Tutup").setStyle('DANGER'),
    ]
  }
  var limited = {
    type: 1,
    components: [
      new MessageButton().setCustomId('modlink_button_create_'+userId).setEmoji("📝").setLabel("New Rule").setStyle('PRIMARY').setDisabled(true),
      new MessageButton().setCustomId('modlink_button_close_'+userId).setEmoji("❌").setLabel("Tutup").setStyle('DANGER'),
    ]
  }
  if (modlink) {
    const array = modlink
    const option = array.map((e,i)=> {
      return {
        label: e.name,
        value: `${e.id}`,
        description: `Created By: ${guild.members.cache.get(e.createdBy).user.username}`
      }
    })
    if (option.length > 25 || option.length === 100) {
      const button = option.length == 100 ? limited : notlimited
      const array = await chunk(option, 25)
      const custom = {
        embeds: [{
          color: color(),
          description: `**__LINK REMOVER__** = ${array.length}`
        }],
        components: [button, array]
      }
      await interaction.channel.send(custom)
    } else {
      const button = option.length == 100 ? limited : notlimited
      const menu = new MessageActionRow().addComponents(new MessageSelectMenu()
        .setCustomId(`modlink_selectmenu_edit_${userId}_1`)
        .setPlaceholder(`Edit Rule`)
        .addOptions(option));
      const custom = {
        embeds: [{
          color: color(),
          description: `**__LINK REMOVER__** = ${array.length}`
        }],
        components: [button, menu]
      }
      await interaction.update(custom)
    }
  } else {
    const custom = {
      embeds: [{
        color: color(),
        description: `**__LINK REMOVER__** = 0`
      }],
      components: [notlimited]
    }
    await interaction.update(custom)
  }
}
async function chunk(obj, i) {
  let chunks = [];
  let count = 0
  while(obj.length){
    count++;
    chunks.push(new MessageActionRow().addComponents(new MessageSelectMenu()
    .setCustomId(`modlink_selectmenu_edit_${userId}_${count}`)
    .setPlaceholder(`Edit Rule ${count}`)
    .addOptions(obj.splice(0,i))));
  }
  return chunks;
}