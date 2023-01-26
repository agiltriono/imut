const { database } = require("../util/util")
const db = database.ref("guild")
module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember, client) {
    const guild = newMember.guild
    // Booster Area
    db.child(guild.id).once("value", async(s) => {
      const booster = s.child("booster")
      const boosterchannel = booster.child("channel").val()
      const ex_booster_role = booster.child("ex_booster_role").val()
      const booster_role = booster.child("booster_role").val()
      const boost_enable = booster.child("enable").val()
      const content = booster.child("content")
      if (newMember.roles.cache.has(booster_role) && !oldMember.roles.cache.has(booster_role)) {
        if (boost_enable != true) return;
        const member = await guild.members.cache.get(newMember.user.id)
        const channel = await guild.channels.cache.get(boosterchannel)
        if (newMember.roles.cache.has(ex_booster_role)) {
          await member.roles.remove(ex_booster_role);
        }
        if (!channel) return;
        if (!content.exists()) return;
        const json = await replace(newMember, content.val())
        if(!json) return;
        await channel.send(json);
      }
      if (oldMember.roles.cache.has(booster_role) && !newMember.roles.cache.has(booster_role)) {
        if (boost_enable != true) return;
        const member = await guild.members.cache.get(newMember.user.id)
        if (!newMember.roles.cache.has(ex_booster_role)) {
          await member.roles.add(ex_booster_role);
        }
      }
    })
  }
}
async function replace(member, json) {
  if (json.hasOwnProperty("content") && json.hasOwnProperty("embeds")) {
    var embed = json.embeds[0] || json.embeds
    var content = json.content
    if (!embed && !content) return;
    if (embed.hasOwnProperty("description")) embed.description = embed.description.replace(/{member}/g, `<@${member.user.id}>`);
    if(content.length != 0) content = content.replace(/{member}/g, `<@${member.user.id}>`);
    if (json.show == "content") {
      return {
        content: content
      }
    } else if (json.show == "embed") {
      return {
        embeds: [embed]
      }
    } else {
      return {
        content: content,
        embeds: [embed]
      }
    }
  } else if (json.hasOwnProperty("content") && !json.hasOwnProperty("embeds")) {
    var content = json.content
    if(content.length != 0) content = content.replace(/{member}/g, `<@${member.user.id}>`);
    return {
      content: content
    }
  } else if (json.hasOwnProperty("embeds") && !json.hasOwnProperty("content")) {
    var embed = json.embeds[0]
    if (embed.hasOwnProperty("description")) embed.description = embed.description.replace(/{member}/g, `<@${member.user.id}>`);
    return {
      embeds: [embed]
    }
  } else {
    return;
  }
}