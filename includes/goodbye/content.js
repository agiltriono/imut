const { MessageActionRow, Modal, TextInputComponent } = require("discord.js")
module.exports.execute = async function(interaction, client, userId) {
  if (interaction.customId.includes("goodbye_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('goodbye_modal_content_input');
    await interaction.update({ content: value })
  } else {
    const modal = new Modal()
      .setCustomId('goodbye_modal_content_'+userId)
      .setTitle('Content')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('goodbye_modal_content_input')
            .setLabel('Content :')
            .setStyle('PARAGRAPH')
            .setPlaceholder('Contoh: Selamat tinggal {member}')
            .setRequired(true)
        )
      ]);
    await interaction.showModal(modal);
  }
}