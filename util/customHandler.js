const { fdb } = require("./util")
const { get } = require("./get")
/*[name] {
  trigger: "",
  type : "",
  response: "",
  whitelist: ""
}*/
module.exports = async function customHandler(msg, auto) {
  const cc = auto
  const type = cc.type
  const content = cc.content
  const embed = cc.embed
  //const reaction = cc.reaction
  //const channel = trigger.child("channel").val()
  if(!content || !embed || !type) return;
  if (type == "content") {
    return msg.channel.send(content)
  } else if (type == "embed") {
    return msg.channel.send({embeds: [embed]})
  } if (type == "reaction") {
    // todo Reaction response
  }
};