const { database, ephemeral } = require(".././../util/util")
const { MessageButton } = require("discord.js");
const db = database.ref("guild");
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  db.child(guild.id).once("value", async (server) => {
    var wc = server.child("wc")
    var embed = wc.child("embed")
    var row1 = {
      type: 1,
      components: [
        new MessageButton().setCustomId('welcomer_button_color_'+userId).setEmoji("🖍").setLabel("Warna").setStyle('PRIMARY'),
        new MessageButton().setCustomId('welcomer_button_title_'+userId).setEmoji("🪧").setLabel("Title").setStyle('PRIMARY'),
        new MessageButton().setCustomId('welcomer_button_description_'+userId).setEmoji("📝").setLabel("Description").setStyle('PRIMARY'),
        new MessageButton().setCustomId('welcomer_button_image_'+userId).setEmoji("🖼").setLabel("Image").setStyle('PRIMARY'),
        new MessageButton().setCustomId('welcomer_button_footer_'+userId).setEmoji("🏷").setLabel("Footer").setStyle('PRIMARY')
      ]
    }
    var row2 = {
      type: 1,
      components: [
        new MessageButton().setCustomId('welcomer_button_reset_'+userId).setEmoji("♻️").setLabel("Reset").setStyle('PRIMARY'),
        new MessageButton().setCustomId('welcomer_button_channel_'+userId).setEmoji("📢").setLabel("Channel").setStyle('PRIMARY'),
        new MessageButton().setCustomId('welcomer_button_test_'+userId).setEmoji("📨").setLabel("Test").setStyle('SUCCESS')
      ]
    }
    var row3 = {
      type: 1,
      components: [
        new MessageButton().setCustomId('welcomer_button_save_'+userId).setEmoji("✅").setLabel("Save").setStyle('SUCCESS'),
        new MessageButton().setCustomId('welcomer_button_close_'+userId).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
      ]
    }
    if (embed.exists()) {
      await interaction.update({
        content: ">>> **CARA PAKAI MENTION PADA DESCRIPTION**\n\n```javascript\n{member} : Mention Member Join.\n{server} : Tampilkan nama server.\n{memberCount} : Jumlah member dalam server.```",
        embeds: [embed.val()],
        components: [row1,row2,row3]
      })
    } else {
      await interaction.update({
        content: ">>> **CARA PAKAI MENTION PADA DESCRIPTION**\n\n```javascript\n{member} : Mention Member Join.\n{server} : Tampilkan nama server.\n{memberCount} : Jumlah member dalam server.```",
        embeds: [{
          description: `Hanya Pratinjau, Mulai mengedit untuk mempercantik embed.`
        }],
        components: [row1,row2,row3]
      })
    }
  })
}