const { MessageActionRow, Modal, TextInputComponent } = require("discord.js")
const { rich } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId) {
  if (interaction.customId.includes("welcomer_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('welcomer_modal_title_input');
    const content = rich(interaction.message.embeds, { title: value })
    await interaction.update({ embeds: [content] })
  } else {
    const modal = new Modal()
      .setCustomId('welcomer_modal_title_'+userId)
      .setTitle('Embed Title')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('welcomer_modal_title_input')
            .setLabel('Judul :')
            .setStyle('SHORT')
            .setPlaceholder('Welcome To Imut Server')
            .setRequired(true)
        )
      ]);
    await interaction.showModal(modal);
  }
}