module.exports = async function linkremover(msg, text, voice){
  const channelId = msg.channelId
  const vc = voice
  const temp = vc.child("temp").child(channelId)
  //const chat_filter = vc.child("chat_filter")
  const content = msg.content.toLowerCase()
  if (temp.exists()) {
    const filter = [
      "youtu.be",
      "youtube.com",
      "soundcloud.com",
      "spotify.com"
    ]
    if(!filter.some(c => content.includes(c))) return await msg.delete();
  } else if (text.exists()) {
      const arr = [...text.val()]
      if(arr.some(c => c.channel.includes(channelId) && c.link.split(",").some(a => content.includes(a)))) return await msg.delete()
    }
  }
}