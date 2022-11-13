module.exports = async function linkremover(msg, text, voice){
  const channelId = msg.channelId
  const vc = voice
  const temp = vc.child("temp").child(channelId)
  const vclink = vc.child("allow_link")
  const content = msg.content.toLowerCase()
  if (temp.exists() && vclink.exists()) {
    const filter = vclink.val().trim().split(",");
    if(filter.length != 0 && !filter.some(c => content.includes(c))) return await msg.delete();
  } else if (text.exists()) {
    const arr = [...text.val()]
    if(arr.some(c => c.channel.includes(channelId) && c.link.split(",").some(a => content.includes(a)))) return await msg.delete()
  }
}