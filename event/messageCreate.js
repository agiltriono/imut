const { database, timeconvert } = require("../util/util");
const shuffle = require("../util/shuffle-array")
const customHandler = require("../util/customHandler")
const linkremover = require("../util/linkremover")
const help = require("../includes/help");
const db = database.ref("guild");
module.exports = {
  name : "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;
    // DATABASE LINE
    db.child(message.guild.id).once("value", async function(data) {
      const blockedchannel = data.child("bc")
      // WORD BLOCK START
      const wb = data.child("wb")
      const blockword = wb.child("word").val();
      const blockenable = wb.child("enable").val();
      const blocklog = wb.child("log").val();
      // WORD BLOCK END
      // TEMPORARY CHANNEL START
      const vc = data.child("voice")
      // TEMPORARY CHANNEL END
      //AUTOMOD START
      const link_remover = data.child("modlink")
      //AUTOMOD END
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
      const str = message.content.toLowerCase()
      if ((str.includes("http://") || str.includes("https://")) && !command && command != helpString) {
        await linkremover(message, link_remover, vc)
      }
      if (!command && command != helpString) {
        if(cc.exists()) {
          let phrase = message.content.replace(/\n/g, ' ')
          let index = [...cc.val()]
          var checkisvc = (arr) => {
            let isvc_enabled = vc.child("temp").child(message.channelId).exists() && arr.allow_vc === "yes";
            let isvc_disabled = arr.channel.includes(message.channelId) && arr.allow_vc === "no";
            if (isvc_enabled || isvc_disabled) {
              return 1;
            } else {
              return 0;
            }
          }
          for(let i = 0; i < index.length;i++) {
            if ((phrase === index[i].trigger && index[i].wildcard === "no") || (phrase.toLowerCase() === index[i].trigger.toLowerCase() && index[i].wildcard === "no")) {
              if (checkisvc(index[i]) === 1) return customHandler(message, index[i])
              break;
            } else if ((phrase.includes(index[i].trigger) && index[i].wildcard === "yes") || (phrase.toLowerCase().includes(index[i].trigger.toLowerCase()) && index[i].wildcard === "yes")) {
              if (checkisvc(index[i])) return customHandler(message, index[i])
              break;
            }
          }
        }
      }
      if ((/^<@(\w|!)[0-9]*>$/).test(message.content.toString())) {
        const usermention = message.content.toString().replace(/\!/gm, '');
        const botmention = `<@${message.client.user.id}>`;
        const isBotMention = botmention.length === usermention.length && usermention === botmention;
        
        if (isBotMention && viewsend) {
            const respond = [
              "@Shinta",
              "Ssshhhhhh..",
              "Aku di kangenin...",
              "Hmmmm.."
            ]
            return message.reply(shuffle.pick(respond, {'picks': 1}))
        }
      }
      if (!message.content.startsWith(prefix)) return;
      if (helpString && hasPerm) { 
          return help(message, client, args, creator, prefix);
        }
      if(!command && command != helpString) return;
      if (!hasPerm) return;
      if(blockedchannel.exists() && blockedchannel.val().includes(message.channel.id)) return;
      try {
          command.run(message, args, creator, prefix);
        
      } catch (error) {
        console.error(error);
      }
    })
  }
}
