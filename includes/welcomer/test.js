const { database, embeds, ephemeral, Welcomer } = require(".././../util/util")
const { MessageButton } = require("discord.js")
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId) {
  await interaction.deferReply()
  const guild = interaction.guild
  const member = interaction.guild.members.cache.get(userId)
  var row = {
    type: 1,
    components: [
      new MessageButton().setCustomId('welcomer_button_close_'+userId).setLabel("Dismis").setEmoji("🗑").setStyle('DANGER')
    ]
  } 
  db.child(guild.id).once('value', async (server) => {
    const wc = server.child("wc");
    const msg = wc.child('m');
    const showEmbed = wc.child("showEmbed").val()
    if (!msg.exists()) return interaction.editReply(Object.assign({},ephemeral("⚠️ Save terlebih dahulu!"),{components:[row]}));
    const options = {
      member: member,
      content: msg.child("content").val(),
      embeds: msg.child("embeds").val(),
      showEmbed: showEmbed
    }
    const comer = new Welcomer(options)
    const well = await comer.render()
    await interaction.editReply(Object.assign({},well, {components: [row]}))
  })
}