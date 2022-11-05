const { database, embeds, getmsg, clear, remove, color } = require(".././../util/util"); 
const db = database.ref("guild");
const { MessageButton } = require("discord.js");

module.exports.help = {
    name: "setup-interface",
    aliases: ["set-ic"],
    usage:"",
    category: "Auto Channel",
    permissions: ["ADMINISTRATOR"],
    description: "Set interface untuk mengelola voice channel."
}
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}
module.exports.run = async function(msg, args, creator, prefix) {
  await msg.delete()
  // claim, unlock, lock, hide, unhide, region, limit, trust, block, kick, rename, untrust, unblock, info
  if (!msg.guild.me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
  const name = [
    {id: "claim", emoji: "<:claim:1037335789345980506>",description:"Klaim Ownership channel."},
    {id: "rename", emoji: "<:rename:1037336608497729618>",description:"Ganti nama Voice Channel."},
    {id: "bitrate", emoji: "<:bitrate:1037336743273308312>",description:"Setel bitrate pada channel."},
    {id: "limit", emoji: "<:limit:1037336697286971432>",description:"Setel batas maksimal jumlah member."},
    {id: "region", emoji: "<:region:1037336000533377034>",description:"Mengganti region channel."},
    {id: "trust", emoji: "<:trust:1037336398480543887>",description:"Tambahkan member pada daftar Trusted Member."},
    {id: "untrust", emoji: "<:untrust:1037336442608820244>",description:"Hapus member dari daftar Trusted Member."},
    {id: "block", emoji: "<:block:1037336352510976011>",description:"Tambahkan member ke daftar Blocked Member."},
    {id: "unblock", emoji: "<:unblock:1037336231803113482>",description:"Hapus member dari daftar Blocked Member."},
    {id: "lock", emoji: "<:lock1:1037336561467011183>", description:"Kunci channel."},
    {id: "unlock", emoji: "<:unlock1:1037336497176719470>",description:"Buka kunci channel."},
    {id: "hide", emoji: "<:hide:1037335960351936542>",description:"Sembunyikan channel."},
    {id: "unhide", emoji:"<:unhide:1037335914806001746>",description: "Perlihatkan channel."},
    {id: "kick", emoji: "<:kick:1037336647785795626>",description:"Kick member dari channel."},
    {id: "info", emoji: "<:info1:1037336184499740694>",description:"Lihat info tentang channel."}
  ]
  const information = name.map(command=>{
    return {
      name: `${command.emoji} ${command.id.capitalize()}`,
      value: command.description
    }
  })
  const button = name.map(name => {
    return new MessageButton().setCustomId("imut_vc_interface_"+name.id)
    //.setLabel(name.id.capitalize())
    .setEmoji(name.emoji)
    .setStyle("SECONDARY")
  })
  function chunk(obj, i) {
    let chunks = [];
    while(obj.length){
      chunks.push({
        type: 1,
       components: obj.splice(0, i)
      });
    }
    return chunks;
  }
  const row = chunk(button, 5)
  const contents = {
    embeds: [{
      color: color(),
      title: msg.client.user.username + ' Interface',
      fields: information,
      footer: {
        text: `discord.gg/imutserver`,
        icon_url: msg.client.user.displayAvatarURL({dynamic:true})
      }
    }],
    components: row
  }
  /* 
    All 3: <(?::\w+:|@!*&*|#)[0-9]+>
    emote: <:\w+:[0-9]+>
    @mention: <@!*&*[0-9]+>
    #channel: <#[0-9]+>
  */
  const ch = /^<#[0-9]*>$/;
  const rgx = /[\\<>@#&!]/gm
  if (ch.test(args[0])) {
    let mention = args[0].replace(rgx, "")
    let channel = msg.guild.channels.cache.get(mention)
    if(!channel) return msg.reply(embeds("❌ Channel tidak ditemukan!"));
    if (channel.type != "GUILD_TEXT") return msg.channel.send(embeds("❌ Channel bukan *Text Channel*"));
    await channel.send(contents)
    await msg.channel.send(embeds(`✅ Interface berhasil di buat pada <#${channel.id}>`))
  } else if (args[0] != undefined && args[0].toLowerCase() === "help") {
    await msg.channel.send(embeds(`🛠 **Setup Interface**\n\`${prefix}setup-interface #text-channel\``));
  } else {
    await msg.channel.send(embeds(`❌ **Salah perintah**\nTry It : \`${prefix}setup-interface help\``))
  }
}