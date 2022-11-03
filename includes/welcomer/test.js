const { database, embeds, ephemeral, Welcomer, fdb } = require(".././../util/util")
const { get, PUT } = require(".././../util/get")
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
    const embed = wc.child('embed');
    const ch = wc.child('channel').val();
    const enable = wc.child("enable").val()
    const channel = interaction.guild.channels.cache.get(ch);
    if (!channel) return interaction.editReply(Object.assign({},ephemeral("⚠️ Channel Belum di set!"),{components:[row]}));
    if (embed.child("description").val() != interaction.message.embeds[0].description) return interaction.editReply(Object.assign({},ephemeral("⚠️ Harap klik **Save** terlebih dahulu."),{components:[row]}));
    const { data } = await get.json(`${fdb}/guild/${member.guild.id}/wc/embed.json`)
    const comer = new Welcomer(member, data)
    const well = await comer.init()
    await interaction.editReply(Object.assign({},well, {components: [row]}))
  })
}