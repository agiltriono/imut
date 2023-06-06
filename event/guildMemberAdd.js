const { Welcomer } = require("../util/util");
module.exports = {
  name : "guildMemberAdd",
  async execute(member, client) {
    const guild = client.guilds.cache.get(member.guild.id);
    const wc = await client.db.get([guild.id, "wc"]);
    const msg = wc["m"];
    const ch = wc["channel"];
    const enable = wc["enable"];
    const channel = client.channels.cache.get(ch);
    if (!enable || !channel) return;
    const options = {
      member: member,
      content: msg["content"],
      embeds: msg["embeds"],
      show: wc["show"]
    }
    const comer = new Welcomer(options)
    const well = await comer.render()
    if (!well) return;
    await channel.send(well)
  }
}