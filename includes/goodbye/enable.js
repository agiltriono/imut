const { embeds, ephemeral, color } = require(".././../util/util");
const { MessageButton } = require("discord.js");
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  await client.db.update([guild.id, "gb"], {enable: true})
  var row = {
    type: 1,
    components: [
      new MessageButton().setCustomId('goodbye_button_disable_'+userId).setEmoji("🚫").setLabel("Disable").setStyle('DANGER'),
      new MessageButton().setCustomId('goodbye_button_edit_'+userId).setEmoji("📝").setLabel("Edit").setStyle('PRIMARY').setDisabled(false),
      new MessageButton().setCustomId('goodbye_button_close_'+userId).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
    ]
  }
  await interaction.update({
    embeds: [{
      color: color(),
      title: "GOODBYE",
      description: `**Status** : Aktif`
    }],
    components: [row]
  })
  
}