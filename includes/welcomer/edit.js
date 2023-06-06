const { ephemeral } = require(".././../util/util")
const { MessageButton } = require("discord.js");
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const db = await client.db.get(guild.id)
  var wc = db.wc
  var msg = wc.m
  var content = msg.content
  var embed = msg.embeds
  var row1 = {
    type: 1,
    components: [
      new MessageButton().setCustomId('welcomer_button_content_'+userId).setEmoji("📝").setLabel("Content").setStyle('PRIMARY'),
      new MessageButton().setCustomId('welcomer_button_description_'+userId).setEmoji("📝").setLabel("Description").setStyle('PRIMARY'),
      new MessageButton().setCustomId('welcomer_button_color_'+userId).setEmoji("🖍").setLabel("Warna").setStyle('PRIMARY'),
      new MessageButton().setCustomId('welcomer_button_title_'+userId).setEmoji("🪧").setLabel("Title").setStyle('PRIMARY'),
      new MessageButton().setCustomId('welcomer_button_image_'+userId).setEmoji("🖼").setLabel("Image").setStyle('PRIMARY')
    ]
  }
  var row2 = {
    type: 1,
    components: [
      new MessageButton().setCustomId('welcomer_button_footer_'+userId).setEmoji("🏷").setLabel("Footer").setStyle('PRIMARY'),
      new MessageButton().setCustomId('welcomer_button_reset_'+userId).setEmoji("♻️").setLabel("Reset").setStyle('PRIMARY'),
      new MessageButton().setCustomId('welcomer_button_channel_'+userId).setEmoji("📢").setLabel("Channel").setStyle('PRIMARY'),
      new MessageButton().setCustomId('welcomer_button_test_'+userId).setEmoji("📨").setLabel("Test").setStyle('SUCCESS')
    ]
  }
  var row3 = {
    type: 1,
    components: [
      new MessageButton().setCustomId('welcomer_button_help_'+userId).setEmoji("❔").setLabel("Help").setStyle('PRIMARY'),
      new MessageButton().setCustomId('welcomer_button_save_'+userId).setEmoji("✅").setLabel("Save").setStyle('SUCCESS'),
      new MessageButton().setCustomId('welcomer_button_close_'+userId).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
    ]
  }
  if (msg) {
    if(embeds.length && content) {
      await interaction.update({
        content: content,
        embeds: embeds,
        components: [row1,row2,row3]
      })
    } else if(!embeds.length && content) {
      await interaction.update({
        content: content,
        components: [row1,row2,row3]
      })
    } else if(embeds.length && !content) {
      await interaction.update({
        embeds: embeds,
        components: [row1,row2,row3]
      })
    }
  } else {
    await interaction.update({
      embeds:[],
      components: [row1,row2,row3]
    })
  }
}
