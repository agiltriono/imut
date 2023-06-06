module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const db = await client.db.get(guild.id);
  const gb = db.gb.m
  if (gb) await client.db.update([guild.id, "gb", "m"], { content: null, embeds: [] });
  await interaction.update({content: null, embeds:[]})
}