const { Welcomer } = require("../util/util");
module.exports = {
  name : "guildMemberAdd",
  async execute(member, client) {
    client.db.child(member.guild.id).once('value', async (server) => {
      const wc = server.child("wc");
      const embed = wc.child('embed');
      const ch = wc.child('channel').val();
      const enable = wc.child("enable").val()
      const channel = client.channels.cache.get(ch);
      if (enable != "yes" || !channel || embed.numChildren() === 0) return;
      const comer = new Welcomer(member, embed.val())
      const well = await comer.init()
      await channel.send(well)
    })
  }
}