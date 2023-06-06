const { embeds, clear } = require(".././../util/util");

module.exports.execute = async function(interaction, client) {
  const guild = interaction.guild
  const member = guild.members.cache.get(interaction.user.id);
  const me = guild.members.cache.get(client.user.id);
  const queue = client.player.getQueue(guild.id);
  
  await interaction.deferReply({ephemeral:false})

  if (!member.voice.channel) return interaction.editReply(embeds('⚠️ **Please join voice terlebih dahulu.**')).then(m => clear(m, 2000));

  if (me.voice.channelId && member.voice.channelId !== me.voice.channelId) return interaction.editReply(embeds(`⛔ Kamu gak join di voice <#${me.voice.channelId}> !`)).then(m => clear(m, 2000));
  
  if(!queue || !queue.playing) return interaction.editReply(embeds('Daftar putar kosong!')).then(m => clear(m, 2000));
  
  const currentTrack = queue.current;
  const next = queue.tracks.length !=0 ? queue.tracks.filter(track => track.title != currentTrack.title).length != 0 ? true : undefined : undefined;
  if (!next) return interaction.editReply(embeds('Daftar putar kosong!')).then(m => clear(m, 2000));
  
  try {
    queue.skip();
  } catch (err) {
    return interaction.editReply(embeds('⚠️ Error saat memuat data!')).then(m=>clear(m, 2000));
  }
  
  await interaction.editReply(embeds(`🎶 Lagu **${currentTrack.title}** diloncat!`)).then(m => clear(m, 2000));
}