const { database, ephemeral } = require(".././../util/util")
const { MessageButton } = require("discord.js");
const db = database.ref("guild");
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const commandName = interaction.values[0]
  db.child(guild.id).once("value", async (server) => {
    var cc = [...server.child('cc').val()]
    var command = cc[cc.findIndex(c=>c.name === commandName)]
    const wild_icon = command.wildcard == "yes" ? "❎" : "✅";
    const wild_style = command.wildcard == "yes" ? "DANGER" : "SUCCESS";
    if (command.type === "content") {
      var row1 = {
      type: 1,
      components: [
        new MessageButton().setCustomId('cc_button_text_'+userId+"_"+commandName).setEmoji("🖍").setLabel("Edit Text").setStyle('PRIMARY'),
        new MessageButton().setCustomId('cc_button_trigger_'+userId+"_"+commandName).setEmoji("⁉️").setLabel("Edit Trigger").setStyle('PRIMARY'),
        new MessageButton().setCustomId('cc_button_wildcard_'+userId+"_"+commandName).setEmoji(wild_icon).setLabel("Wildcard").setStyle(wild_style),
        new MessageButton().setCustomId('cc_button_embed_'+userId+"_"+commandName).setEmoji("🔁").setLabel("Rich Embed").setStyle('PRIMARY'),
        new MessageButton().setCustomId('cc_button_reset_'+userId+"_"+commandName).setEmoji("♻️").setLabel("Reset").setStyle('PRIMARY')
        ]
      }
      var row2 = {
        type: 1,
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
    } else {
      var row1 = {
        type: 1,
        components: [
          new MessageButton().setCustomId('cc_button_color_'+userId+"_"+commandName).setEmoji("🖍").setLabel("Warna").setStyle('PRIMARY'),
          new MessageButton().setCustomId('cc_button_title_'+userId+"_"+commandName).setEmoji("🪧").setLabel("Title").setStyle('PRIMARY'),
          new MessageButton().setCustomId('cc_button_description_'+userId+"_"+commandName).setEmoji("📝").setLabel("Description").setStyle('PRIMARY'),
          new MessageButton().setCustomId('cc_button_image_'+userId+"_"+commandName).setEmoji("🖼").setLabel("Image").setStyle('PRIMARY'),
          new MessageButton().setCustomId('cc_button_footer_'+userId+"_"+commandName).setEmoji("🏷").setLabel("Footer").setStyle('PRIMARY')
        ]
      }
      var row2 = {
        type: 1,
        components: [
          new MessageButton().setCustomId('cc_button_trigger_'+userId+"_"+commandName).setEmoji("⁉️").setLabel("Edit Trigger").setStyle('PRIMARY'),
          new MessageButton().setCustomId('cc_button_wildcard_'+userId+"_"+commandName).setEmoji(wild_icon).setLabel("Wildcard").setStyle(wild_style),
          new MessageButton().setCustomId('cc_button_content_'+userId+"_"+commandName).setEmoji("🔁").setLabel("Text Biasa").setStyle('PRIMARY'),
          new MessageButton().setCustomId('cc_button_reset_'+userId+"_"+commandName).setEmoji("♻️").setLabel("Reset").setStyle('PRIMARY')
        ]
      }
      var row3 = {
        type:1,
        components:[
          new MessageButton().setCustomId('cc_button_channel_'+userId+"_"+commandName).setEmoji("💬").setLabel("Channel").setStyle('PRIMARY'),
          new MessageButton().setCustomId('cc_button_save_'+userId+"_"+commandName).setEmoji("✅").setLabel("Save").setStyle('SUCCESS'),
          new MessageButton().setCustomId('cc_button_delete_'+userId+"_"+commandName).setLabel("Hapus").setEmoji("🗑").setStyle('DANGER'),
          new MessageButton().setCustomId('cc_button_close_'+userId+"_"+commandName).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
        ]
      }
      await interaction.update({
        content: null,
        embeds: [command.embed],
        components: [row1,row2,row3]
      })
    }
  })
}