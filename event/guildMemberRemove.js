const { Welcomer } = require("../util/util");
module.exports = {
  name : "guildMemberRemove",
  async execute(member, client) {
    client.db.child(member.guild.id).once('value', async (server) => {
      const gb = server.child("gb");
      const embed = gb.child('embed');
      const ch = gb.child('channel').val();
      const enable = gb.child("enable").val()
      const channel = client.channels.cache.get(ch);
      if (enable != "yes" || !channel || embed.numChildren() === 0) return;
      const comer = new Welcomer(member, embed.val())
      const well = await comer.init()
      await channel.send(well)
    })
  }
}