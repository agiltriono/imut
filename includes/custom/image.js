const { MessageActionRow, Modal, TextInputComponent } = require("discord.js")
const { rich } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId) {
  if (interaction.customId.includes("cc_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('cc_modal_image_input');
    const content = rich(interaction.message.embeds[0], { image: { url: value }})
    await interaction.update({ embeds: [content] })
  } else {
    const modal = new Modal()
      .setCustomId('cc_modal_image_'+userId)
      .setTitle('Embed Image')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('cc_modal_image_input')
            .setLabel('Url/Link Image')
            .setStyle('SHORT')
            .setPlaceholder('Contoh: https://example.com/foto.png')
            .setRequired(true)
        )
      ]);
    await interaction.showModal(modal);
  }
}