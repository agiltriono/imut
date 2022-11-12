const { database, ephemeral } = require(".././../util/util")
const { MessageButton } = require("discord.js");
const db = database.ref("guild");
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  db.child(guild.id).once("value", async (server) => {
    var wc = server.child("gb")
    var msg = wc.child("m")
    var row1 = {
      type: 1,
      components: [
        new MessageButton().setCustomId('goodbye_button_content_'+userId).setEmoji("📝").setLabel("Content").setStyle('PRIMARY'),
        new MessageButton().setCustomId('goodbye_button_description_'+userId).setEmoji("📝").setLabel("Description").setStyle('PRIMARY'),
        new MessageButton().setCustomId('goodbye_button_color_'+userId).setEmoji("🖍").setLabel("Warna").setStyle('PRIMARY'),
        new MessageButton().setCustomId('goodbye_button_title_'+userId).setEmoji("🪧").setLabel("Title").setStyle('PRIMARY'),
        new MessageButton().setCustomId('goodbye_button_image_'+userId).setEmoji("🖼").setLabel("Image").setStyle('PRIMARY')
      ]
    }
    var row2 = {
      type: 1,
      components: [
        new MessageButton().setCustomId('goodbye_button_footer_'+userId).setEmoji("🏷").setLabel("Footer").setStyle('PRIMARY'),
        new MessageButton().setCustomId('goodbye_button_reset_'+userId).setEmoji("♻️").setLabel("Reset").setStyle('PRIMARY'),
        new MessageButton().setCustomId('goodbye_button_channel_'+userId).setEmoji("📢").setLabel("Channel").setStyle('PRIMARY'),
        new MessageButton().setCustomId('goodbye_button_test_'+userId).setEmoji("📨").setLabel("Test").setStyle('SUCCESS')
      ]
    }
    var row3 = {
      type: 1,
      components: [
        new MessageButton().setCustomId('goodbye_button_help_'+userId).setEmoji("❔").setLabel("Help").setStyle('PRIMARY'),
        new MessageButton().setCustomId('goodbye_button_save_'+userId).setEmoji("✅").setLabel("Save").setStyle('SUCCESS'),
        new MessageButton().setCustomId('goodbye_button_close_'+userId).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
      ]
    }
    if (msg.exists()) {
      if(msg.embeds.exists() && msg.content.exists()) {
        await interaction.update({
          content: msg.content.val(),
          embeds: [msg.embeds.val()],
          components: [row1,row2,row3]
        })
      }
      if(!msg.embeds.exists() && msg.content.exists()) {
        await interaction.update({
          content: msg.content.val(),
          components: [row1,row2,row3]
        })
      }
      if(msg.embeds.exists() && !msg.content.exists()) {
        await interaction.update({
          embeds: [msg.embeds.val()],
          components: [row1,row2,row3]
        })
      }
    } else {
      await interaction.update({
        embeds:[],
        components: [row1,row2,row3]
      })
    }
  })
}