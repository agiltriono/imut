const { equal, embeds, ephemeral, Welcomer } = require(".././../util/util")
const { MessageButton } = require("discord.js")

module.exports.execute = async function(interaction, client, userId) {
  await interaction.deferReply()
  const guild = interaction.guild
  const member = interaction.guild.members.cache.get(userId)
  const editor_content = interaction.message.content || null;
  const editor_embed = interaction.message.embeds;
  var row = {
    type: 1,
    components: [
      new MessageButton().setCustomId('welcomer_button_close_'+userId).setLabel("Dismis").setEmoji("🗑").setStyle('DANGER')
    ]
  }     
  const options = {
    member: member,
    content: editor_content,
    embeds: editor_embed
  }
  const comer = new Welcomer(options)
  const well = await comer.render()
  if (!well) return interaction.editReply(Object.assign({}, embeds("⚠️ Tidak ada konten yang dapat di tampilkan"), {components: [row]}));
  await interaction.editReply(Object.assign({},well, {components: [row]}))
}
