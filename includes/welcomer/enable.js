const { embeds, ephemeral, color } = require(".././../util/util")
const { MessageButton } = require("discord.js");
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  await client.db.update([guild.id, "wc"], {enable:true})
  var row = {
    type: 1,
    components: [
      new MessageButton().setCustomId('welcomer_button_disable_'+userId).setEmoji("🚫").setLabel("Disable").setStyle('DANGER'),
      new MessageButton().setCustomId('welcomer_button_edit_'+userId).setEmoji("📝").setLabel("Edit").setStyle('PRIMARY').setDisabled(false),
      new MessageButton().setCustomId('welcomer_button_close_'+userId).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
    ]
  }
  await interaction.update({
    embeds: [{
      color: color(),
      title: "WELCOMER",
      description: `**Status** : Aktif`
    }],
    components: [row]
  })
  
}