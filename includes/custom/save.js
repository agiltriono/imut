const { database, embeds } = require(".././../util/util")
const { MessageButton } = require("discord.js")
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId, args) {
  await interaction.deferReply()
  const guild = interaction.guild
  const commandName = args[2]
  db.child(guild.id).once("value", async (server) => {
    const cc = [...server.child("cc").val()]
    const embed = interaction.message.embeds
    const content = interaction.message.content
    var row = {
      type: 1,
      components: [
        new MessageButton().setCustomId('cc_button_close_'+userId).setLabel("Dismis").setEmoji("🗑").setStyle('DANGER')
      ]
    } 
    if (content.length != 0) {
      cc[cc.findIndex(c=>c.name === commandName)].content = content
      await db.child(guild.id).update({cc:cc})
      await interaction.editReply(Object.assign({},embeds(`✅ Command **${commandName}** telah di record.\nJangan lupa untuk menutup pengaturan.`), {components: [row]}))
    } else if (embed.length != 0) {
      cc[cc.findIndex(c=>c.name === commandName)].embed = embed[0]
      await db.child(guild.id).update({cc:cc})
      await interaction.editReply(Object.assign({},embeds(`✅ Command **${commandName}** telah di record.\nJangan lupa untuk menutup pengaturan.`), {components: [row]}))
    }
  })
}