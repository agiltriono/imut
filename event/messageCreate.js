const { database, timeconvert } = require("../util/util");
const shuffle = require("../util/shuffle-array")
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
      const bad_word = data.child("badword")
      const wordlist = bad_word.child("word").val();
      const wordblock = bad_word.child("enable").val();
      const log = bad_word.child("log").val();
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
      if (wordblock === true && wordlist != null && hasPerm) {
        const badword =  new BadWord(message, client, languages, wordlist, infraction, punishment, log).init()
      }
      if(blockedchannel.exists() && blockedchannel.val().includes(message.channel.id)) return;
      if (!command && command != helpString) {
        var date = new Date()
        var zone = date.toLocaleString("id-ID", {timeZone: "Asia/Jakarta", hours12: false}).split(" ")[1].split(".")[0]
        const time = zone.startsWith("0") ? parseInt(zone.replace("0", "")) : parseInt(zone)
        var string = message.content.toLowerCase()
        if (string.includes("pagi")|| string.includes("siang") || string.includes("sore") || string.includes("petang") || string.includes("malam") || string.includes("dini")) {
          //pagi
          if (zone >= 5 && zone <= 10) {
            if (string.includes("siang") || string.includes("sore") || string.includes("petang") || string.includes("malam") || string.includes("dini")) return message.channel.send(shuffle.pick(["Pagi akak!","Ini kan pagi akak","Gak tau ah", "Maybe, besok jalan sama Queensyg","Oh Iyah, mungkin ke china sama rabellan","Aku sibuk kalo pagi"], {"picks":1}));
            if(string.includes("pagi")) return message.channel.send("Pagi juga 👋");
          }
          //siang
          if (zone >= 11 && zone <= 14) {
            if (string.includes("pagi") || string.includes("sore") || string.includes("petang") || string.includes("malam") || string.includes("dini")) return message.channel.send(shuffle.pick(["Siang dodol!","Hmmm","bodo ah", "mau tidur tapi siang", " Ke oyo ?"], {"picks":1}));
            if(string.includes("siang")) return message.channel.send("Siang kak,");
          }
          //sore
          if (zone >= 15 && zone <= 17) {
            if (string.includes("pagi") || string.includes("siang") || string.includes("petang") || string.includes("malam") || string.includes("dini")) return message.channel.send(shuffle.pick(["Sore akak!","Juling ? sore cok","ihh","Ohh gitu", "Yaudah iya", " Galau ya ?"], {"picks":1}));
            if(string.includes("sore")) return message.channel.send("Sore gaes 😉");
          }
          //petang
          if (zone >= 18 && zone <= 19) {
            if (string.includes("pagi") || string.includes("siang") || string.includes("sore") || string.includes("malam") || string.includes("dini")) return mesaage.channel.send(shuffle.pick(["Petang akak!","Inikan petang ish","bodo amat ah akak capek", "Apaan sih petang juga", "Setiap menjelang malam queen pasti selalu semangat tau!"], {"picks":1}));
            if (string.includes("petang")) return message.channel.send("Menjelang malam 💬");
          }
          //malam
          if (zone >= 20 && zone <= 24) {
            if (string.includes("pagi") || string.includes("siang") || string.includes("sore") || string.includes("petang") || string.includes("dini")) return message.channel.send(shuffle.pick(["Jam rusak ?!","Malam njir","Apa iyah ?", "Au ah gelap"], {"picks":1}));
            if(string.includes("malam")) return message.channel.send("Selamat malam 🙏");
          }
          // dini
          if (zone >= 0 && zone <= 3) {
            if (string.includes("pagi") || string.includes("siang") || string.includes("sore") || string.includes("petang") || string.includes("malam")) return message.channel.send(shuffle.pick(["Dini bukan dana","bodo amat ah", "Apa sih", "Jangan nakal ya sama shinta ! awas aja shayang gak mau temenan lagi : (", "kok gitu sih"], {"picks":1}));
            if(string.includes("dini")) return message.channel.send("Menjelang pagi 💬");
          }
        } else if(cc.exists()) {
          let phrase = message.content.replace(/\n/g, ' ')
          let index = [...cc.val()]
          for(let i = 0; i < index.length;i++) {
            if ((phrase.startsWith(index[i].trigger) && index[i].wildcard === "no") || (phrase.toLowerCase().startsWith(index[i].trigger.toLowerCase()) && index[i].wildcard === "no")) {
              return customHandler(message, index[i])
              break;
            }
            if ((phrase.includes(index[i].trigger) && index[i].wildcard === "yes") || (phrase.toLowerCase().includes(index[i].trigger.toLowerCase()) && index[i].wildcard === "yes")) {
              return customHandler(message, index[i])
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
              "@Shintaa",
              "Ssshhhhhh..",
              "Aku di kangenin...",
              "Aku cantik ya ciee di cariin 🥰",
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
      
      try {
          command.run(message, args, creator, prefix);
        
      } catch (error) {
        console.error(error);
      }
    })
  }
}