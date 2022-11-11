const { database, embeds, ephemeral, color } = require(".././../util/util")
const { MessageButton } = require("discord.js");
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  await db.child(guild.id).child("gb").update({enable:"yes"})
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