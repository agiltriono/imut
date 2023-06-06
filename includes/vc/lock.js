const { embeds, ephemeral } = require(".././../util/util")
module.exports.execute = async function(interaction, client) {
  // voice > temp > userId
  await interaction.deferReply({ephemeral:true})
  const guild = interaction.guild
  const member = guild.members.cache.get(interaction.user.id);
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) return interaction.editReply(ephemeral("⚠️ **Please join voice terlebih dahulu.**"));
  const db = await client.db.get(guild.id)
  const vc = db.voice
  const temp = vc.temp[voiceChannel.id]
  if (!temp) return interaction.editReply(ephemeral(`⛔ Kamu gak join di creator voice **${client.user.username}**!`));
  var owner = temp.owner
  if (owner != interaction.user.id) return interaction.editReply(ephemeral("⚠️ Akses ditolak! Kamu bukan owner!"));
  var ghost = temp.ghost
  if (ghost === true) return interaction.editReply(ephemeral(`⚠️ Tidak dapat menggunakan **LOCK** ketika channel dalam keadaan tersembunyi, Gunakan **UNHIDE** terlebih dahulu.`));
  let channel = interaction.guild.channels.resolve(voiceChannel.id)
  let permit = channel.permissionOverwrites.cache.filter(c=> c.type == "role" && !["984301622492541010","985762912062808174"].includes(c.id.toString()));
  permit.forEach(async (c)=> {
    await channel.permissionOverwrites.edit(c.id, {'CONNECT': false})
  })
  await interaction.editReply(ephemeral(`🔒 Channel **${voiceChannel.name}** dikunci!`));
}
