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
      const ex_booster_role = boostet.child("ex_booster_role").val()
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
        await channel.send(content.val());
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