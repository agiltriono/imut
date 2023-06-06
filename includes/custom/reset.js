module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const type = interaction.message.embeds.length != 0 ? "embeds" : "content"
  if (type === "embeds") {
    await interaction.update({embeds:[{
      description: "Reset Success...Edit Me Again!"
    }]})
  } else {
    await interaction.update({content:"Reset Success...Edit Me Again!"})
  }
}