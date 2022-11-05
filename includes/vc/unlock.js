const { database, embeds, ephemeral } = require(".././../util/util")
const db = database.ref("guild")
module.exports.execute = async function(interaction, client) {
  // voice > temp > userId
  const guild = interaction.guild
  const member = guild.members.cache.get(interaction.user.id);
  const voiceChannel = member.voice.channel;
  await interaction.deferReply({ephemeral:true})
  if (!voiceChannel) return interaction.editReply(ephemeral("⚠️ **Please join voice terlebih dahulu.**"));
    db.child(guild.id).once("value", async (server) => {
      var vc = server.child("voice")
      var temp = vc.child("temp").child(voiceChannel.id)
      if(temp.numChildren() === 0) return interaction.editReply(ephemeral(`⛔ Kamu gak join di creator voice **${client.user.username}**!`));
      var owner = temp.child("owner").val()
      if (owner != interaction.user.id) return interaction.editReply(ephemeral("⚠️ Akses ditolak! Kamu bukan owner!"));
      var ghost = temp.child("ghost").val()
      if (ghost === "yes") return interaction.editReply(ephemeral(`⚠️ Tidak dapat menggunakan **UNLOCK** ketika channel dalam keadaan tersembunyi, Gunakan **UNHIDE** terlebih dahulu.`));
      let channel = interaction.guild.channels.resolve(voiceChannel.id)
     let permit = channel.permissionOverwrites.cache.filter(perm=> perm.type == "role");
     permit.forEach(async (perm)=> {
      await channel.permissionOverwrites.edit(perm.id, {
        'CONNECT': true
      })
    })
    await interaction.editReply(ephemeral(`🔓 Channel **${voiceChannel.name}** dibuka!`));
  })
}