const { ephemeral } = require(".././../util/util")
const { TextInputComponent, MessageActionRow, Modal, MessageButton } = require("discord.js");
const { POST } = require(".././../util/get")
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild;
  const db = await client.db.get(guild.id);
  var cc = db.cc;
  if (interaction.customId.includes("cc_modal")) {
    const field = interaction.fields
    const name = field.getTextInputValue('cc_modal_create_name_input');
    const trigger = field.getTextInputValue('cc_modal_create_trigger_input');
    const init = {
      name: name,
      type: "content",
      trigger: trigger,
      channel: "",
      content : "Pratinjau Text",
      embed : {description: "Pratinjau Embed"},
      wildcard: false,
      allow_vc: false
    }
    cc.push(init)
    const commandName = init.name;
    var row1 = {
      type: 1,
      components: [
        new MessageButton().setCustomId('cc_button_text_'+userId+"_"+commandName).setEmoji("🖍").setLabel("Edit Text").setStyle('PRIMARY'),
        new MessageButton().setCustomId('cc_button_trigger_'+userId+"_"+commandName).setEmoji("⁉️").setLabel("Edit Trigger").setStyle('PRIMARY'),
        new MessageButton().setCustomId('cc_button_wildcard_'+userId+"_"+commandName).setEmoji("✅").setLabel("Wildcard").setStyle("SUCCESS"),
        new MessageButton().setCustomId('cc_button_embed_'+userId+"_"+commandName).setEmoji("🔁").setLabel("Rich Embed").setStyle('PRIMARY'),
        new MessageButton().setCustomId('cc_button_reset_'+userId+"_"+commandName).setEmoji("♻️").setLabel("Reset").setStyle('PRIMARY')
        ]
    }
    var row2 = {
      type:1,
      components: [
        new MessageButton().setCustomId('cc_button_channel_'+userId+"_"+commandName).setEmoji("💬").setLabel("Channel").setStyle('PRIMARY'),
        new MessageButton().setCustomId('cc_button_allowvc_'+userId+"_"+commandName).setEmoji("🎙").setLabel("Enable In VC").setStyle("SUCCESS"),
        new MessageButton().setCustomId('cc_button_save_'+userId+"_"+commandName).setEmoji("✅").setLabel("Save").setStyle('SUCCESS'),
        new MessageButton().setCustomId('cc_button_delete_'+userId+"_"+commandName).setLabel("Hapus").setEmoji("🗑").setStyle('DANGER'),
        new MessageButton().setCustomId('cc_button_close_'+userId+"_"+commandName).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
      ]
    }
    await client.db.update(guild.id, {cc:cc})
    await interaction.update({
      content: init.content,
      embeds: [],
      components: [row1,row2]
    })
  } else {
    if(cc.length === 100) return interaction.reply(ephemeral("⚠️ Limit Data Auto Respond Tercapai."));
    const modal = new Modal()
      .setCustomId('cc_modal_create_'+userId)
      .setTitle('Create New')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('cc_modal_create_name_input')
            .setLabel('Nama (Tanpa Spasi) :')
            .setStyle('SHORT')
            .setPlaceholder('contoh: autorespond')
            .setRequired(true)),
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('cc_modal_create_trigger_input')
            .setLabel('Trigger :')
            .setStyle('SHORT')
            .setPlaceholder('contoh: Kamu Manis')
            .setRequired(true))
      ]);
    await interaction.showModal(modal);
  }
}
