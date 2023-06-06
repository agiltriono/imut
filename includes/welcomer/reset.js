module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const db = await client.db.get(guild.id)
  const wc = db.wc.m
  if (wc) await client.db.update([guild.id, "wc", "m"], {content:null,embeds:[]});
  await interaction.update({content: null,embeds:[]})
}