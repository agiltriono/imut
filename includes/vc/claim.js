const { embeds, ephemeral } = require(".././../util/util")
module.exports.execute = async function(interaction, client) {
  // voice > temp > userId
  await interaction.deferReply({ephemeral: true})
  const guild = interaction.guild
  const member = guild.members.cache.get(interaction.user.id);
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) return interaction.editReply(ephemeral("⚠️ **Please join voice terlebih dahulu.**"));
  const db = await client.db.get(guild.id);
  const vc = db.voice
  const temp = vc.temp[voiceChannel.id]
  if(!temp) return interaction.editReply(ephemeral(`⛔ Kamu gak join di creator voice **${client.user.username}**!`));
  var owner = temp.owner
  if (owner == interaction.user.id) return interaction.editReply(ephemeral("⚠️ Kamu sudah memiliki hak akses **Owner**!"));
  let channel = interaction.guild.channels.resolve(voiceChannel.id)
  let isEmpty = channel.members.filter(member=> member.user.id === owner).size
  if (isEmpty != 0) return interaction.editReply(ephemeral("⚠️ Akses ditolak! Maaf tapi **Owner** masih ada di voice!"))
  await client.db.update([guild.id, "voice", "temp", voiceChannel.id], {owner: member.user.id})
  await channel.permissionOverwrites.edit(member.user.id, {
    "VIEW_CHANNEL": true,
    "MANAGE_CHANNELS": true,
    "MANAGE_ROLES": true,
    "CONNECT": true
  })
  await channel.permissionOverwrites.cache.get(owner).delete()
  await interaction.editReply(ephemeral(`🔑 Hak akses di berikan! sekarang kamu adalah **Owner**`));
}
