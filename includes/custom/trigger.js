const { MessageActionRow, Modal, TextInputComponent, MessageButton } = require("discord.js")
const { database, embeds } = require(".././../util/util")
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const commandName = args[2]
  if (interaction.customId.includes("cc_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('cc_modal_trigger_input');
    var row = {
      type: 1,
      components: [
        new MessageButton().setCustomId('cc_button_close_'+userId).setLabel("Dismis").setEmoji("🗑").setStyle('DANGER')
      ]
    } 
    db.child(guild.id).once("value", async(server) => {
      var cc = [...server.child("cc").val()]
      cc[cc.findIndex(i=>i.name === commandName)].trigger = value;
      await db.child(guild.id).update({cc:cc})
      await interaction.reply(Object.assign({}, embeds(`✏️ **Trigger di ganti**\n🆕 **${value}**`), {components: [row]}))
    })
  } else {
    const modal = new Modal()
      .setCustomId('cc_modal_trigger_'+userId+"_"+commandName)
      .setTitle('Edit Trigger')
      .addComponents([
        new MessageActionRow().addComponents(
          new TextInputComponent()
            .setCustomId('cc_modal_trigger_input')
            .setLabel('Trigger :')
            .setStyle('SHORT')
            .setPlaceholder('Contoh : Kamu Cantik')
            .setRequired(true)
        )
      ]);
    await interaction.showModal(modal);
  }
}