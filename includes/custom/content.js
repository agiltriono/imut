const { ephemeral } = require(".././../util/util")
const { MessageButton } = require("discord.js");
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const commandName = args[2]
  const db = await client.db.get(guild.id);
  var cc = db.cc;
  cc[cc.findIndex(c=>c.name === commandName)].type = "content"
  var command = cc[cc.findIndex(c=>c.name === commandName)]
  var wild_icon = command.wildcard == true ? "✅" : "❎";
  var wild_style = command.wildcard == true ? "SUCCESS" : "DANGER";
  var allow_vc_style = command.allow_vc == true ? ["DANGER", "Disable In VC"] : ["SUCCESS", "Enable In VC"];
  await db.child(guild.id).update({cc:cc})
  var row1 = {
  type: 1,
  components: [
    new MessageButton().setCustomId('cc_button_text_'+userId+"_"+commandName).setEmoji("🖍").setLabel("Edit Text").setStyle('PRIMARY'),
    new MessageButton().setCustomId('cc_button_trigger_'+userId+"_"+commandName).setEmoji("⁉️").setLabel("Edit Trigger").setStyle('PRIMARY'),
    new MessageButton().setCustomId('cc_button_wildcard_'+userId+"_"+commandName).setEmoji("✅").setLabel(wild_icon).setStyle(wild_style),
    new MessageButton().setCustomId('cc_button_embed_'+userId+"_"+commandName).setEmoji("🔁").setLabel("Rich Embed").setStyle('PRIMARY'),
    new MessageButton().setCustomId('cc_button_reset_'+userId+"_"+commandName).setEmoji("♻️").setLabel("Reset").setStyle('PRIMARY')
    ]
  }
  var row2 = {
    type:1,
    components: [
      new MessageButton().setCustomId('cc_button_channel_'+userId+"_"+commandName).setEmoji("💬").setLabel("Channel").setStyle('PRIMARY'),
      new MessageButton().setCustomId('cc_button_allowvc_'+userId+"_"+commandName).setEmoji("🎙").setLabel(allow_vc_style[1]).setStyle(allow_vc_style[0]),
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
}
