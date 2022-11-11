const { Welcomer } = require("../util/util");
module.exports = {
  name : "guildMemberRemove",
  async execute(member, client) {
    client.db.child(member.guild.id).once('value', async (server) => {
      const gb = server.child("gb");
      const msg = gb.child('m');
      const ch = gb.child('channel').val();
      const enable = gb.child("enable").val()
      const channel = client.channels.cache.get(ch);
      if (enable != "yes" || !channel || msg.numChildren() === 0) return;
      const options = {
        member: member,
        content: msg.child("content").val(),
        embeds: msg.child("embeds").val()
      }
      const comer = new Welcomer(options)
      const well = await comer.render()
      await channel.send(well)
    })
  }
}