const { embeds, clear } = require(".././../util/util");
const { setPlayer } = require(".././../util/music");

module.exports.execute = async function(interaction, client) {
  const guild = interaction.guild
  const member = guild.members.cache.get(interaction.user.id);
  const me = guild.members.cache.get(client.user.id);
  const queue = client.player.getQueue(guild.id);
  
  await interaction.deferReply({ephemeral:false})

  if (!member.voice.channel) return interaction.editReply(embeds('You are not in a voice channel!')).then(m => clear(m, 2000));

  if (me.voice.channelId && member.voice.channelId !== me.voice.channelId) return interaction.editReply(embeds('You are not in my voice channel!')).then(m => clear(m, 2000));
  
  if(!queue || !queue.playing) return interaction.editReply(embeds('Queue is empty!')).then(m => clear(m, 2000));
    
  try {
    queue.destroy();
  } catch (err) {
    return interaction.editReply(embeds('An Error Occured!!')).then(m=>clear(m, 2000));
  }
  
  await setPlayer(guild)
  await interaction.editReply(embeds('🛑 Queue end!')).then(m => clear(m, 2000));
}