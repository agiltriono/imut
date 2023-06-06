const { embeds, ephemeral, Welcomer } = require(".././../util/util")
const { MessageButton } = require("discord.js")
module.exports.execute = async function(interaction, client, userId) {
  await interaction.deferReply()
  const guild = interaction.guild
  const member = interaction.guild.members.cache.get(userId)
  const db - await client.db.get(guild.id)
  var row = {
    type: 1,
    components: [
      new MessageButton().setCustomId('welcomer_button_close_'+userId).setLabel("Dismis").setEmoji("🗑").setStyle('DANGER')
    ]
  } 
  const wc = db.wc;
  const msg = wc.m;
  const show = wc.show
  if (!msg) return interaction.editReply(Object.assign({},ephemeral("⚠️ Save terlebih dahulu!"),{components:[row]}));
  const options = {
    member: member,
    content: msg.content,
    embeds: msg.embeds,
    show: show
  }
  const comer = new Welcomer(options)
  const well = await comer.render()
  await interaction.editReply(Object.assign({},well, {components: [row]}))
}