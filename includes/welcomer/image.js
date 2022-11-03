// https://cloud.githubusercontent.com/assets/414918/11165708/fbeb5164-8b0e-11e5-893d-9d0e91cb3d32.png
const { MessageActionRow, Modal, TextInputComponent } = require("discord.js")
const { clear, rich, embeds, remove, color } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId) {
  if (interaction.customId.includes("welcomer_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('welcomer_modal_image_input');
    const content = rich(interaction.message.embeds[0], { image: { url: value }})
    await interaction.update({ embeds: [content] })
  } else {
    const modal = new Modal()
      .setCustomId('welcomer_modal_image_'+userId)
      .setTitle('Embed Image')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('welcomer_modal_image_input')
            .setLabel('Url/Link Image')
            .setStyle('SHORT')
            .setPlaceholder('https://example.com/welcome.png')
            .setRequired(true)
        )
      ]);
    await interaction.showModal(modal);
  }
}