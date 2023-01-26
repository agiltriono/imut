const { clear, embeds } = require(".././../util/util");

module.exports.help = {
    name: "leave",
    aliases: ["disconnect"],
    usage:"name",
    category: "Auto Channel",
    permissions: ["SEND_MESSAGES"],
    description: "Leave from voice."
}

module.exports.run = async (msg, args, creator, prefix) => {
  await msg.delete()
  const guild = msg.guild
  const me = msg.guild.members.cache.get(msg.client.user.id)
  const member = msg.guild.members.cache.get(creator.id)
    if (member.user.id != "905894705492025375") return;
  if (!me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
  try {
    if (!me.voice.channel) return msg.channel.send(embeds('Sorry, i haven\'t connected to channel yet!')).then(m => clear(m, 2000));
    if (!member.voice.channel) return msg.channel.send(embeds('You are not in a voice channel!')).then(m => clear(m, 2000));
    if (member.voice.channel && me.voice.channel && member.voice.channelId !== me.voice.channelId) return msg.channel.send(embeds('Hey, Kamu harus join ke channel aku!')).then(m => clear(m, 2000));
    
    if(me.voice.channel) {
      await me.voice.disconnect();
    }
  } catch (error) {
    console.log(error)
  }
};