const { database, embeds } = require(".././../util/util")
const { MessageButton } = require("discord.js")
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const commandName = args[2]
  db.child(guild.id).once("value", async (server) => {
    var cc = [...server.child("cc").val()]
    cc[cc.findIndex(c=>c.name === commandName)].allow_vc = cc[cc.findIndex(c=>c.name === commandName)].allow_vc == "yes" ? "no" : "yes";
    await db.child(guild.id).update({cc:cc})
    var command = cc[cc.findIndex(c=>c.name === commandName)]
    const dismis = {
      type: 1,
      components: [
        new MessageButton().setCustomId('cc_button_close_'+userId).setLabel("Dismis").setEmoji("🗑").setStyle('DANGER')
      ]
    }
    
    function getButtons(type) {
      const wild_style = command.wildcard == "yes" ? ["❎", "DANGER"] : ["✅", "SUCCESS"];
      const allow_vc_style = command.allow_vc == "yes" ? ["DANGER", "Disable In VC"] : ["SUCCESS", "Enable In VC"];
      if (type === "content") {
        var row1 = {
          type: 1,
          components: [
            new MessageButton().setCustomId('cc_button_text_'+userId+"_"+commandName).setEmoji("🖍").setLabel("Edit Text").setStyle('PRIMARY'),
            new MessageButton().setCustomId('cc_button_trigger_'+userId+"_"+commandName).setEmoji("⁉️").setLabel("Edit Trigger").setStyle('PRIMARY'),
            new MessageButton().setCustomId('cc_button_wildcard_'+userId+"_"+commandName).setEmoji(wild_style[0]).setLabel("Wildcard").setStyle(wild_style[1]),
            new MessageButton().setCustomId('cc_button_embed_'+userId+"_"+commandName).setEmoji("🔁").setLabel("Rich Embed").setStyle('PRIMARY'),
            new MessageButton().setCustomId('cc_button_reset_'+userId+"_"+commandName).setEmoji("♻️").setLabel("Reset").setStyle('PRIMARY')
            ]
        }
        var row2 = {
          type: 1,
          components: [
            new MessageButton().setCustomId('cc_button_channel_'+userId+"_"+commandName).setEmoji("💬").setLabel("Channel").setStyle('PRIMARY'),
            new MessageButton().setCustomId('cc_button_allowvc_'+userId+"_"+commandName).setEmoji("🎙").setLabel(allow_vc_style[1]).setStyle(allow_vc_style[0]),
            new MessageButton().setCustomId('cc_button_save_'+userId+"_"+commandName).setEmoji("✅").setLabel("Save").setStyle('SUCCESS'),
            new MessageButton().setCustomId('cc_button_delete_'+userId+"_"+commandName).setLabel("Hapus").setEmoji("🗑").setStyle('DANGER'),
            new MessageButton().setCustomId('cc_button_close_'+userId+"_"+commandName).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
          ]
        }
        return [row1,row2]
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
            new MessageButton().setCustomId('cc_button_wildcard_'+userId+"_"+commandName).setEmoji(wild_style[0]).setLabel("Wildcard").setStyle(wild_style[1]),
            new MessageButton().setCustomId('cc_button_content_'+userId+"_"+commandName).setEmoji("🔁").setLabel("Text Biasa").setStyle('PRIMARY'),
            new MessageButton().setCustomId('cc_button_reset_'+userId+"_"+commandName).setEmoji("♻️").setLabel("Reset").setStyle('PRIMARY')
          ]
        }
        var row3 = {
          type:1,
          components:[
            new MessageButton().setCustomId('cc_button_channel_'+userId+"_"+commandName).setEmoji("💬").setLabel("Channel").setStyle('PRIMARY'),
            new MessageButton().setCustomId('cc_button_allowvc_'+userId+"_"+commandName).setEmoji("🎙").setLabel(allow_vc_style[1]).setStyle(allow_vc_style[0]),
            new MessageButton().setCustomId('cc_button_save_'+userId+"_"+commandName).setEmoji("✅").setLabel("Save").setStyle('SUCCESS'),
            new MessageButton().setCustomId('cc_button_delete_'+userId+"_"+commandName).setLabel("Hapus").setEmoji("🗑").setStyle('DANGER'),
            new MessageButton().setCustomId('cc_button_close_'+userId+"_"+commandName).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
          ]
        }
        return [row1,row2,row3]
      }
    }
    
    await interaction.update({components: getButtons(command.type)})
    await interaction.message.reply(Object.assign({},embeds(command.allow_vc == "yes" ? `✅ Custom command **${commandName}** tampil di Voice Chat.` : `❎ Custom command **${commandName}** tidak akan tampil di Voice Chat.`), {components: [dismis]}))
  })
}

