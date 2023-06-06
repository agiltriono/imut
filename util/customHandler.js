module.exports = async function customHandler(msg, cc) {
  const type = cc.type
  const content = cc.content
  const embed = cc.embed
  if(!content || !embed || !type) return;
  if (type == "content") {
    return msg.channel.send(content)
  } else if (type == "embeds") {
    return msg.channel.send({embeds: [embed]})
  } if (type == "reaction") {
    // todo Reaction response
  }
};