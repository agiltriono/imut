const { database, embeds } = require(".././../util/util")
const { MessageButton } = require("discord.js")
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const commandName = args[2]
  db.child(guild.id).once("value", async (server) => {
    const cc = [...server.child("cc").val()]
    const command = cc[cc.findIndex(c=>c.name === commandName)]
    const wild_icon = command.wildcard == "yes" ? "✅" : "❎";
    const wild_style = command.wildcard == "yes" ? "SUCCESS" : "DANGER";
    const dismis = {
      type: 1,
      components: [
        new MessageButton().setCustomId('cc_button_close_'+userId).setLabel("Dismis").setEmoji("🗑").setStyle('DANGER')
      ]
    }
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
      if (command.wildcard === "yes") {
        cc[cc.findIndex(c=>c.name === commandName)].wildcard = "no"
        await db.child(guild.id).update({cc:cc})
        await interaction.update({components: [row1,row2]})
        await interaction.message.reply(Object.assign({},embeds(`❎ Wildcard ${commandName} dimatikan.`), {components: [dismis]}))
      } else {
        cc[cc.findIndex(c=>c.name === commandName)].wildcard = "yes"
        await db.child(guild.id).update({cc:cc})
        await interaction.update({components: [row1,row2]})
        await interaction.message.reply(Object.assign({},embeds(`✅ Wildcard **${commandName}** diaktifkan.`), {components: [dismis]}))
      }
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
      if (command.wildcard === "yes") {
        cc[cc.findIndex(c=>c.name === commandName)].wildcard = "no"
        await db.child(guild.id).update({cc:cc})
        await interaction.update({components: [row1,row2,row3]})
        await interaction.message.reply(Object.assign({},embeds(`❎ Wildcard ${commandName} dimatikan.`), {components: [dismis]}))
      } else {
        cc[cc.findIndex(c=>c.name === commandName)].wildcard = "yes"
        await db.child(guild.id).update({cc:cc})
        await interaction.update({components: [row1,row2,row3]})
        await interaction.message.reply(Object.assign({},embeds(`✅ Wildcard **${commandName}** diaktifkan.`), {components: [dismis]}))
      }
    }
  })
}