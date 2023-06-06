const { embeds, ephemeral } = require(".././../util/util")
module.exports.execute = async function(interaction, client) {
  // voice > temp > userId
  await interaction.deferReply({ephemeral:true})
  const guild = interaction.guild
  const member = guild.members.cache.get(interaction.user.id)
  const voiceChannel = member.voice.channel
  if (!voiceChannel) return interaction.editReply(ephemeral("⚠️ **Please join voice terlebih dahulu.**"));
  const db = await client.db.get(guild.id)
  const vc = db.voice
  const temp = vc.temp[voiceChannel.id]
  if(!temp) return interaction.editReply(ephemeral(`⛔ Kamu gak join di creator voice **${client.user.username}**!`));
  var owner = temp.owner
  if (owner != interaction.user.id) return interaction.editReply(ephemeral("⚠️ Akses ditolak! Kamu bukan owner!"));
  var ghost = temp.ghost
  if (ghost === true) return interaction.editReply(ephemeral(`⚠️ Channel sedang dalam mode tersembunyi. Gunakan **UNHIDE** untuk merubah visibilitas.`));
  let channel = interaction.guild.channels.resolve(voiceChannel.id)
  let permit = channel.permissionOverwrites.cache.filter(c=>c.type == "role" && c.id != interaction.guild.roles.everyone.id && !["984301622492541010","985762912062808174"].includes(c.id.toString()));
  permit.forEach(async (c) => {
    await channel.permissionOverwrites.edit(c.id,{"VIEW_CHANNEL": false});
  })
  await client.db.update([guild.id, "voice", "temp", voiceChannel.id], {ghost: true })
  await interaction.editReply(ephemeral(`🔑 Channel **${voiceChannel.name}** tersembunyi!`));
}
