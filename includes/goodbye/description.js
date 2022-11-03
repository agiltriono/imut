const { MessageActionRow, Modal, TextInputComponent } = require("discord.js")
const { clear, rich, embeds, remove, color } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId) {
  if (interaction.customId.includes("goodbye_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('goodbye_modal_description_input');
    const content = rich(interaction.message.embeds[0], { description : value })
    await interaction.update({ embeds: [content] })
  } else {
    const modal = new Modal()
      .setCustomId('goodbye_modal_description_'+userId)
      .setTitle('Embed Description')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('goodbye_modal_description_input')
            .setLabel('Deskripsi :')
            .setStyle('PARAGRAPH')
            .setPlaceholder('Selamat Tinggal {member}')
            .setRequired(true)
        )
      ]);
    await interaction.showModal(modal);
  }
}