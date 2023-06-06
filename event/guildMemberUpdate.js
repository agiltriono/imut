module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember, client) {
    const guild = client.guilds.cache.get(newMember.guild.id)
    // Booster Area
    const booster = await client.db.get([guild.id, "booster"])
    const boosterchannel = booster["channel"]
    const ex_booster_role = booster["ex_booster_role"]
    const booster_role = booster["booster_role"]
    const boost_enable = booster["enable"]
    const content = booster["content"]
    const boost_role = await guild.roles.cache.get(booster_role)
    const ex_role = await guild.roles.cache.get(ex_booster_role)
    const member = await guild.members.cache.get(newMember.user.id)
    if (newMember.roles.cache.has(booster_role) && !oldMember.roles.cache.has(booster_role)) {
      if (!boost_enable) return;
      const channel = await guild.channels.cache.get(boosterchannel)
      if (!boost_role) return;
      if (!ex_role) return;
      if (newMember.roles.cache.has(ex_booster_role)) {
        await member.roles.remove(ex_booster_role);
      }
      if (!channel) return;
      if (!content) return;
      const json = await replace(newMember, booster)
      if(!json) return;
      await channel.send(json);
    }
    if (oldMember.roles.cache.has(booster_role) && !newMember.roles.cache.has(booster_role)) {
      if (!boost_enable) return;
      if (!boost_role) return;
      if (!ex_role) return;
      if (!newMember.roles.cache.has(ex_booster_role)) {
        await member.roles.add(ex_booster_role);
      }
    }
  }
}
async function replace(member, json) {
  var obj = json.content;
  var show = json.show;
  if (show == "content") {
    if(obj.content.length != 0) obj.content = obj.content.replace(/{member}/g, `<@${member.user.id}>`);
    return {
      content: obj.content
    }
  } else {
    if (obj.embeds.hasOwnProperty("description")) obj.embeds.description = obj.embeds.description.replace(/{member}/g, `<@${member.user.id}>`);
    return {
      embeds: [obj.embeds]
    }
  }
}