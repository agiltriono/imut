// MODLINK MODULE
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
    for (let i = 0; i < arr.length; i++) {
      if(arr[i].channel.includes(channelId)) {
        const index = arr[i]
        const link = [...index.link.trim().split(",")].filter(c=>c)
        const action = index.action.trim()
        if(action == "allow") {
          // required
          if (link.length != 0 && link.some(a=> content.includes(a))) return;
          return await msg.delete();
        }
        if (action === "disallow") {
          // Exception
          if(link.some(a=> content.includes(a))) return;
          return await msg.delete()
        } else {
          return;
        }
        break;
      }
    }
  } else {
    return;
  }
}