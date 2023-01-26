const { MessageActionRow, Modal, TextInputComponent } = require("discord.js")
const { rich } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId) {
  if (interaction.customId.includes("cc_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('cc_modal_description_input');
    const content = rich(interaction.message.embeds[0], { description : value })
    await interaction.update({ embeds: [content] })
  } else {
    const modal = new Modal()
      .setCustomId('cc_modal_description_'+userId)
      .setTitle('Embed Description')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('cc_modal_description_input')
            .setLabel('Deskripsi :')
            .setStyle('PARAGRAPH')
            .setPlaceholder('Contoh: Hey, Kok kamu tag aku..')
            .setRequired(true)
        )
      ]);
    await interaction.showModal(modal);
  }
}