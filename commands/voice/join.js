const { clear, embeds } = require(".././../util/util");
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports.help = {
    name: "join",
    aliases: ["connect"],
    usage:"name",
    category: "Auto Channel",
    permissions: ["SEND_MESSAGES"],
    description: "Join to voice."
}

module.exports.run = async (msg, args, creator, prefix) => {
  await msg.delete()
  const guild = msg.guild
    const me = msg.guild.members.cache.get(msg.client.user.id)
  const member = msg.guild.members.cache.get(creator.id)
    if (member.user.id != "905894705492025375") return;
  if (!me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
  try {
    if(me.voice.channel) return msg.channel.send(embeds(`Hey, Aku udah lagi di voice!`)).then(m=>clear(m,2000));
    if (!member.voice.channel) return msg.channel.send(embeds('Kamu gak ada di voice channel!')).then(m => clear(m, 2000));
    if (member.voice.channel && me.voice.member.voice.channel && me.voice.channel && member.voice.channelId !== me.voice.channelId && member.voice.channelId !== me.voice.channelId) return msg.channel.send(embeds('Hey, Kamu harus join ke channel aku!')).then(m => clear(m, 2000));
    
      await joinVoiceChannel({
          channelId: msg.member.voice.channel.id,
          guildId: msg.guild.id,
          adapterCreator: msg.guild.voiceAdapterCreator
      })
  } catch (error) {
    console.log(error)
  }
};