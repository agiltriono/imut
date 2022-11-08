const { database, timeconvert } = require("../util/util");
const customHandler = require("../util/customHandler")
const help = require("../includes/help");
const db = database.ref("guild");
module.exports = {
  name : "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;
    db.child(message.guild.id).once("value", async function(data) {
      const blockedchannel = data.child("bc")
      const prefix = data.child("prefix").val() ? data.child("prefix").val() : client.prefix;
      const cc = data.child("cc")
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const commandName = args.shift().toLowerCase();
    	const command =
        client.commands.get(commandName) ||
        client.commands.get(client.aliases.get(commandName));
      const helpString = commandName == "help" || commandName == "h";
      const creator = {id:message.author.id};
      const viewsend = message.guild.me.permissions.has("VIEW_CHANNEL") && message.guild.me.permissions.has("SEND_MESSAGES");
      const manages = message.guild.me.permissions.has("MANAGE_MESSAGES") && message.guild.me.permissions.has("MANAGE_CHANNELS");
      const hasPerm = viewsend && manages;
      if(blockedchannel.exists() && blockedchannel.val().includes(message.channel.id)) return;
      if(!command && command != helpString && cc.exists()) {
        let phrase = message.content.replace(/\n/g, ' ')
        let index = [...cc.val()]
        for(let i = 0; i < index.length;i++) {
          if (phrase.startsWith(index[i].trigger) && index[i].wildcard === "no") {
            return customHandler(message, index[i])
            break;
          }
          if (phrase.includes(index[i].trigger) && index[i].wildcard === "yes") {
            return customHandler(message, index[i])
            break;
          }
        }
      }
      if ((/^<@(\w|!)[0-9]*>$/).test(message.content.toString())) {
        const usermention = message.content.toString().replace(/\!/gm, '');
        const botmention = `<@${message.client.user.id}>`;
        const isBotMention = botmention.length === usermention.length && usermention === botmention;
        
        if (isBotMention && viewsend) {
            await message.react("😤")
            return message.reply("Apa sih ngetag ngetag aku 🔨").then(async m => {
              await m.react("❤")
            });
        }
      }
      if (!message.content.startsWith(prefix)) return;
      if (helpString && hasPerm) { 
          return help(message, client, args, creator, prefix);
        }
      if(!command && command != helpString) return;
      if (!hasPerm) return;
      
      try {
          command.run(message, args, creator, prefix);
        
      } catch (error) {
        console.error(error);
      }
    })
  }
}