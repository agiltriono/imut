const { database, ephemeral } = require(".././../util/util")
const { MessageButton } = require("discord.js");
const db = database.ref("guild");
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const commandName = args[2]
  db.child(guild.id).once("value", async (server) => {
    var cc = [...server.child('cc').val()]
    cc[cc.findIndex(c=>c.name === commandName)].type = "content"
    var command = cc[cc.findIndex(c=>c.name === commandName)]
    await db.child(guild.id).update({cc:cc})
    var row1 = {
    type: 1,
    components: [
      new MessageButton().setCustomId('cc_button_text_'+userId+"_"+commandName).setEmoji("🖍").setLabel("Edit Text").setStyle('PRIMARY'),
      new MessageButton().setCustomId('cc_button_trigger_'+userId+"_"+commandName).setEmoji("⁉️").setLabel("Edit Trigger").setStyle('PRIMARY'),
      new MessageButton().setCustomId('cc_button_embed_'+userId+"_"+commandName).setEmoji("🔁").setLabel("Rich Embed").setStyle('PRIMARY'),
      new MessageButton().setCustomId('cc_button_reset_'+userId+"_"+commandName).setEmoji("♻️").setLabel("Reset").setStyle('PRIMARY')
      ]
    }
    var row2 = {
      type:1,
      components: [
        new MessageButton().setCustomId('cc_button_channel_'+userId+"_"+commandName).setEmoji("💬").setLabel("Channel").setStyle('PRIMARY'),
        new MessageButton().setCustomId('cc_button_save_'+userId+"_"+commandName).setEmoji("✅").setLabel("Save").setStyle('SUCCESS'),
        new MessageButton().setCustomId('cc_button_delete_'+userId+"_"+commandName).setLabel("Hapus").setEmoji("🗑").setStyle('DANGER'),
        new MessageButton().setCustomId('cc_button_close_'+userId+"_"+commandName).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
      ]
    }
    await interaction.update({
      content: command.content,
      embeds: [],
      components: [row1,row2]
    })
  })
}