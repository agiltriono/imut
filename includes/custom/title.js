const { MessageActionRow, Modal, TextInputComponent } = require("discord.js")
const { rich } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId) {
  if (interaction.customId.includes("cc_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('cc_modal_title_input');
    const content = rich(interaction.message.embeds[0], { title: value })
    await interaction.update({ embeds: [content] })
  } else {
    const modal = new Modal()
      .setCustomId('cc_modal_title_'+userId)
      .setTitle('Embed Title')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('cc_modal_title_input')
            .setLabel('Judul :')
            .setStyle('SHORT')
            .setPlaceholder('Contoh: Imut Official Response')
            .setRequired(true)
        )
      ]);
    await interaction.showModal(modal);
  }
}