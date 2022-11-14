const { database, ephemeral } = require(".././../util/util")
const { MessageButton } = require("discord.js");
const db = database.ref("guild");
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const ruleId = interaction.values[0]
  db.child(guild.id).once("value", async (server) => {
    var modlink = [...server.child('modlink').val()]
    var rule = modlink[modlink.findIndex(c=>c.id === ruleId)]
    var row1 = {
      type: 1,
      components: [
        new MessageButton().setCustomId('modlink_button_link_'+userId+"_"+ruleId).setEmoji("🔗").setLabel("Link").setStyle('PRIMARY'),
        new MessageButton().setCustomId('modlink_button_action_'+userId+"_"+ruleId).setEmoji("🛡").setLabel("ACTION").setStyle('PRIMARY'),
        new MessageButton().setCustomId('modlink_button_channel_'+userId+"_"+ruleId).setEmoji("💬").setLabel("Channel").setStyle('PRIMARY')
      ]
    }
    var row2 = {
      type:1,
      components: [
        new MessageButton().setCustomId('modlink_button_delete_'+userId+"_"+ruleId).setLabel("Hapus").setEmoji("🗑").setStyle('DANGER'),
        new MessageButton().setCustomId('modlink_button_close_'+userId+"_"+ruleId).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
      ]
    }
    await interaction.update({
      embeds: [{ 
        title: "LINK REMOVER PANEL",
        description: `**Rule Name :**\n${rule.name}\n**Created At :**\n${new Date(parseInt(rule.createdAt)).toLocaleString("id-ID", {timeZone: "Asia/Jakarta"})}\n**Created By :**\n<@${rule.createdBy}>`
      }],
      components: [row1,row2]
    })
  })
}