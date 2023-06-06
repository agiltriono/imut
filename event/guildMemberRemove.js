const { Welcomer } = require("../util/util");
module.exports = {
  name : "guildMemberRemove",
  async execute(member, client) {
    const guild = client.guilds.cache.get(member.guild.id);
    const gb = await client.db.get([guild.id, "gb"]);
    const msg = gb.m;
    const ch = gb.channel;
    const enable = gb.enable;
    const channel = client.channels.cache.get(ch);
    if (!enable || !channel) return;
    const options = {
      member: member,
      content: msg.content,
      embeds: msg.embeds,
      show: gb.show
    }
    const comer = new Welcomer(options)
    const well = await comer.render()
    await channel.send(well)
  }
}
