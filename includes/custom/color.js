const { MessageActionRow, Modal, TextInputComponent } = require("discord.js")
const { rich } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId) {
  if (interaction.customId.includes("cc_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('cc_modal_color_input');
    const content = rich(interaction.message.embeds[0], { color: value })
    await interaction.update({ embeds: [content] })
  } else {
    const modal = new Modal()
      .setCustomId('cc_modal_color_'+userId)
      .setTitle('Embed Color')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('cc_modal_color_input')
            .setLabel('Warna :')
            .setStyle('SHORT')
            .setPlaceholder('Contoh: #f136f7')
            .setRequired(true)
        )
      ]);
    await interaction.showModal(modal);
  }
}