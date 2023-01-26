// Check mesaage latency and API response
const { embeds } = require(".././../util/util");

module.exports.help = {
  name: "ping",
  aliases: ["ping-pong"],
  usage: "",
  category: "Utility",
  permissions: ["ADMINISTRATOR"],
  description: "Ping kecepatan respon bot dalam milidetik"
}
module.exports.run = async (msg, args, creator, client, prefix) => {
  try {
    const permis = [
      (msg.member.permissions.has("ADMINISTRATOR")),
      (msg.member.permissions.has("MANAGE_GUILD")),
      (creator.id === msg.guild.ownerId)
    ].filter(u=>u.toString() != "false")
    if(permis.length === 0) return;
    if (!msg.guild.me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
    
    const m = await msg.reply(embeds("..."))
    
    const ping = Math.round(m.createdTimestamp - msg.createdTimestamp);
    
    return m.edit(embeds(`:green_circle: Latency ${'..'.repeat(Math.ceil(ping / 100))} \`${ping}ms\`\n:green_circle: Api ${'..'.repeat(Math.ceil(Math.round(msg.client.ws.ping) / 100))} \`${Math.round(m.client.ws.ping)}ms\``));
		
  } catch (error) {
    console.log(error)
  }
}