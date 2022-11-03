const { MessageActionRow, Modal, TextInputComponent } = require("discord.js")
const { clear, rich, embeds, remove, color } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId) {
  if (interaction.customId.includes("goodbye_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('goodbye_modal_color_input');
    const content = rich(interaction.message.embeds[0], { color: value })
    await interaction.update({ embeds: [content] })
  } else {
    const modal = new Modal()
      .setCustomId('goodbye_modal_color_'+userId)
      .setTitle('Embed Color')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('goodbye_modal_color_input')
            .setLabel('Warna :')
            .setStyle('SHORT')
            .setPlaceholder('Masukan Warna..EG: #f136f7')
            .setRequired(true)
        )
      ]);
    await interaction.showModal(modal);
  }
}