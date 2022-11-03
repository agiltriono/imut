require('dotenv').config();
const path = require("path")
const { get } = require("./get");
const colorful = require("./color");
const admin = require("firebase-admin");
const cloudinary = require('cloudinary').v2;
cloudinary.config();
admin.initializeApp({
  credential: admin.credential.cert({
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL
}),
  databaseURL: process.env.FIREBASE_DATABASEURL
})
exports.getrole = function (event, name) {
  return event.roles.cache.find(r => r.name.toLowerCase() === name.toLowerCase())
}
exports.embeds = function(content, footer) {
  if (typeof footer == "undefined") {
    return {
      embeds : [{
        description : content,
        color: "#ff9ad1"
      }]
    }
  } else {
    return {
      embeds : [{
        color: "#ff9ad1",
        description : content,
        footer: {
          text: footer.text,
          icon_url: footer.url
        }
      }]
    }
  }
}
exports.ephemeral = function(content, footer) {
  if (typeof footer == "undefined") {
    return {
      embeds : [{
        description : content,
        color: "#ff9ad1"
      }],
      ephemeral: true
    }
  } else {
    return {
      embeds : [{
        color: "#ff9ad1",
        description : content,
        footer: {
          text: footer.text,
          icon_url: footer.url
        }
      }],
      ephemeral: true
    }
  }
}
exports.remove = async function(message, id) {
  try {
    let msg = await message.channel.messages.fetch(id);
    return msg.delete()
  } catch(err) {
    console.error(err)
  }
}

exports.getmsg = async function(msg, id) {
  let e = await msg.channel.messages.fetch(id);
  return e
}

exports.clear = function(content, time) {
  var timer = 0
  if( typeof time != "undefined") {
    timer = time
    return new Promise(resolve => {
       setTimeout(() => {
         resolve(content.delete());
       }, timer);
    });
  } else {
    return new Promise(resolve => {
       setTimeout(() => {
         resolve(content.delete());
       }, timer);
    });
  }
}

exports.numformat = function(num) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K';
    } else if(num > 1000000){
        return (num/1000000).toFixed(1) + 'M';
    } else if(num < 900){
        return num;
    }
}
exports.genId = function (length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
exports.games = class games {
  constructor(name, guild, started) {
    this.game = name;
    this.guild = guild;
    this.started = started;
  }
}
exports.Welcomer = class Welcomer {
  constructor (member, content, client) {
    this.client = client
    this.member = member;
    this.embed = content;
    this.content = content.description
  }
  async init () {
    let msg = await this.render()
    return msg
  }
  async relace (member, content) {
    var object = content.split(' ')
    var temp = [...object]
    var memberMention = /^{member}/
    var guildName = /^{server}/
    var memberCount = /^{memberCount}/
    for (let i = 0; i < object.length; i++) {
      if (memberMention.test(object[i])) {
        temp[i] = temp[i].replace(memberMention, `<@${member.user.id}>`)
      }
      if (guildName.test(object[i])) {
        temp[i] = temp[i].replace(guildName, `${member.guild.name}`)
      }
      if (memberCount.test(object[i])) {
        temp[i] = temp[i].replace(memberCount, `${member.guild.memberCount}`)
      }
    }
    return temp.map(obj => obj).join(' ')
  }
  async render () {
    var msg = await this.relace(this.member, this.content);
    var description = msg.replace(/\\n/g, '\n')
    return { embeds: [Object.assign({}, this.embed, { description: description })]}
  }
}
exports.rich = function (e, n) {
  return Object.assign({},e,n)
}
exports.timeconvert = function(secs) {
  const hours = Math.floor(secs / (60 * 60));
  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);
  const divisor_for_seconds = divisor_for_minutes % 60;
  const seconds = Math.ceil(divisor_for_seconds);
  return {
    h: hours,
    m: minutes,
    s: seconds
  };
}
exports.color = function (c) {
  if (c == undefined) return "#ff9ad1";
  if (c == "random") return colorful();
  return colorful()
}

exports.cloudinary = cloudinary;
exports.database = admin.database();
exports.DISCORD_TOKEN = process.env.DISCORD_TOKEN;
exports.get = get;
exports.fdb = process.env.FIREBASE_DATABASEURL;
exports.SUPPORT_LINK = process.env.SUPPORT_LINK;
exports.PREFIX = process.env.client_prefix;
exports.dev_id = process.env.dev_id;