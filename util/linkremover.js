// MODLINK MODULE
module.exports = async function linkremover(msg, text, vc){
  const channelId = msg.channelId
  if (!vc["temp"][channelId]) return;
  const temp = vc["temp"][channelId];
  const vclink = vc["allow_link"]
  const content = msg.content.toLowerCase()
  if (temp.length && vclink.length) {
    const filter = vclink.trim().split(",");
    if(filter.length != 0 && !filter.some(c => content.includes(c))) return await msg.delete();
  } else if (text.length) {
    const arr = [...text]
    for (let i = 0; i < arr.length; i++) {
      if(arr[i].channel.includes(channelId)) {
        const index = arr[i]
        const link = [...index.link.trim().split(",")].filter(c=>c)
        const action = index.action.trim()
        if(action == "allow") {
          // required
          if (link.some(a=> content.includes(a))) return;
          return await msg.delete();
        }
        if (action === "disallow") {
          // Exception
          if(link.some(a=> content.includes(a))) return await msg.delete();
          return;
        } else {
          return;
        }
	return;
        break;
      }
    }
  } else {
    return;
  }
}