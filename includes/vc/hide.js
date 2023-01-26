const { database, embeds, ephemeral } = require(".././../util/util")
const db = database.ref("guild")
module.exports.execute = async function(interaction, client) {
  // voice > temp > userId
  const guild = interaction.guild
  const member = guild.members.cache.get(interaction.user.id);
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) return interaction.reply(ephemeral("⚠️ **Please join voice terlebih dahulu.**"));
  db.child(guild.id).once("value", async (server) => {
    var vc = server.child("voice")
    var temp = vc.child("temp").child(voiceChannel.id)
    if(temp.numChildren() === 0) return interaction.reply(ephemeral(`⛔ Kamu gak join di creator voice **${client.user.username}**!`));
    var owner = temp.child("owner").val()
    if (owner != interaction.user.id) return interaction.reply(ephemeral("⚠️ Akses ditolak! Kamu bukan owner!"));
    var ghost = temp.child("ghost").val()
    if (ghost === "yes") return interaction.reply(ephemeral(`⚠️ Channel sedang dalam mode tersembunyi. Gunakan **UNHIDE** untuk merubah visibilitas.`));
    await interaction.deferReply({ephemeral:true})
    let channel = interaction.guild.channels.resolve(voiceChannel.id)
    let permit = channel.permissionOverwrites.cache.filter(c=>c.type == "role" && c.id != interaction.guild.roles.everyone.id && !["984301622492541010","985762912062808174"].includes(c.id.toString()));
    permit.forEach(async (c) => {
      await channel.permissionOverwrites.edit(c.id,{"VIEW_CHANNEL": false});
    })
    await db.child(guild.id).child("voice").child("temp").child(voiceChannel.id).update({ghost:"yes"})
    await interaction.editReply(ephemeral(`🔑 Channel **${voiceChannel.name}** tersembunyi!`));
  })
}