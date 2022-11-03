const { MessageActionRow, Modal, TextInputComponent } = require("discord.js")
module.exports.execute = async function(interaction, client, userId) {
  if (interaction.customId.includes("cc_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('cc_modal_text_input');
    const content = interaction.message.content
    await interaction.update({content:value})
  } else {
    const modal = new Modal()
      .setCustomId('cc_modal_text_'+userId)
      .setTitle('Message Response')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('cc_modal_text_input')
            .setLabel('Message :')
            .setStyle('PARAGRAPH')
            .setPlaceholder('Contoh : Apa kamu kok ngetag ngetag aku..')
            .setRequired(true)
        )
      ]);
    await interaction.showModal(modal);
  }
}