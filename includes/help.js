const { embeds, getmsg, remove, color } = require("../util/util"); 
const fs = require("fs");
module.exports = async function help(msg, client, args, creator) {
  const permis = [
    (msg.member.permissions.has("ADMINISTRATOR")),
    (msg.member.permissions.has("MANAGE_GUILD")),
    (creator.id === msg.guild.ownerId)
  ].filter(u=>u.toString() != "false")
  if(permis.length === 0) return;
  var emoji = function (emo) {
    let list = [
      { name: "Auto Channel", emoji:"🔊"},
      { name: "Setting", emoji:"⚙️"},
      { name: "Utility", emoji:"🛠"},
      { name: "Custom Command", emoji:"📝"},
      { name: "Auto Mod", emoji:"🛡"},
      { name: "Developer", emoji:"🔧"},
      ]
    return list.find(e => e.name.toLowerCase() == emo.toLowerCase())
  }
  var list = msg.client.commands.map(cmd => cmd.help.category)
  var category = [...new Set(list)].map(cat => {
	  const dir = msg.client.commands.filter(obj => obj.help.category === cat);
    if (dir.size != 0) {
  	  return `${emoji(cat).emoji} **${cat}**\n${dir.map(obj => `*${obj.help.name}*`).join(", ")}`
  	}
  }).join("\n")
	await msg.channel.send({
	  embeds: [{
	    color: color(),
	    title: "Command List",
		  description: category,
		  footer: {
		    text: `discord.gg/imutserver`, 
		    icon_url: client.user.displayAvatarURL({dynamic:true})
		  }
	  }]
	})
}
