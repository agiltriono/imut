const { MessageActionRow, Modal, TextInputComponent } = require("discord.js")
const { clear, rich, embeds, remove, color } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId) {
  if (interaction.customId.includes("goodbye_modal_")) {
    const field = interaction.fields
    const text = field.getTextInputValue('goodbye_modal_footer_text');
    const icon_url = field.getTextInputValue('goodbye_modal_footer_icon_url');
    const content = rich(interaction.message.embeds[0], { footer: {text: text, icon_url:icon_url}})
    await interaction.update({ embeds: [content] })
  } else {
    const modal = new Modal()
      .setCustomId('goodbye_modal_footer_'+userId)
      .setTitle('Embed Footer')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('goodbye_modal_footer_text')
            .setLabel('Text :')
            .setStyle('SHORT')
            .setPlaceholder('discord.gg/imutserver')
            .setRequired(true)),
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('goodbye_modal_footer_icon_url')
            .setLabel('Icon Url :')
            .setStyle('SHORT')
            .setPlaceholder('https://example.com/icon.png')
            .setRequired(true)),
      ]);
    await interaction.showModal(modal);
  }
}