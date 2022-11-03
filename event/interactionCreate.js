module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    const go  = (name, filepath, args) => {
      return require(`../includes/${filepath}`)[name](interaction, client, args)
    }
    const helper = (string) => {
      let arg = string.split('_')
      return arg[0]
    }
    if (interaction.isButton()) {
      if (interaction.message.partial) {
        try {
          await interaction.message.fetch()
        } catch (error) {
          interaction.reply({
            content: "something went wrong !",
            ephemeral: true
          })
        }
      }
      if (interaction.customId.includes('imut_vc_interface_')) return go("vc", "vc/vc", interaction.customId.replace("imut_vc_interface_", ""));
      if (interaction.customId.includes('welcomer_button_')) return go("welcomer", "welcomer/welcomer", interaction.customId.replace("welcomer_button_", ""));
      if (interaction.customId.includes('goodbye_button_')) return go("goodbye", "goodbye/goodbye", interaction.customId.replace("goodbye_button_", ""));
      if (interaction.customId.includes('cc_button_')) return go("custom", "custom/custom", interaction.customId.replace("cc_button_", ""));
    }
    if (interaction.isSelectMenu()) {
      if (interaction.message.partial) {
        try {
          await interaction.message.fetch()
        } catch (error) {
          interaction.reply({
            content: "something went wrong !",
            ephemeral: true
          })
        }
      }
      if (interaction.customId.includes('imut_vc_selectmenu_')) return go("vc", "vc/vc", helper(interaction.customId.replace("imut_vc_selectmenu_", '')));
      if (interaction.customId.includes('welcomer_selectmenu_')) return go("welcomer", "welcomer/welcomer", interaction.customId.replace("welcomer_selectmenu_", ''));
      if (interaction.customId.includes('goodbye_selectmenu_')) return go("goodbye", "goodbye/goodbye", interaction.customId.replace("goodbye_selectmenu_", ''));
      if (interaction.customId.includes('cc_selectmenu_')) return go("custom", "custom/custom", interaction.customId.replace("cc_selectmenu_", ''));
    }
    if (interaction.isModalSubmit()) {
      if (interaction.message.partial) {
        try {
          await interaction.message.fetch()
        } catch (error) {
          interaction.reply({
            content: "something went wrong !",
            ephemeral: true
          })
        }
      }
      if (interaction.customId.includes('imut_vc_modal_')) return go("vc", "vc/vc", interaction.customId.replace("imut_vc_modal_", ''));
      if (interaction.customId.includes('welcomer_modal_')) return go("welcomer", "welcomer/welcomer", interaction.customId.replace("welcomer_modal_", ''));
      if (interaction.customId.includes('goodbye_modal_')) return go("goodbye", "goodbye/goodbye", interaction.customId.replace("goodbye_modal_", ''));
      if (interaction.customId.includes('cc_modal_')) return go("custom", "custom/custom", interaction.customId.replace("cc_modal_", ''));
    }
  }
}