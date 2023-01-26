const { Welcomer } = require("../util/util");
module.exports = {
  name : "guildMemberAdd",
  async execute(member, client) {
    client.db.child(member.guild.id).once('value', async (server) => {
      const wc = server.child("wc");
      const msg = wc.child('m');
      const ch = wc.child('channel').val();
      const enable = wc.child("enable").val()
      const showEmbed = wc.child("showEmbed").val()
      const channel = client.channels.cache.get(ch);
      if (enable != "yes" || !channel || msg.numChildren() === 0) return;
      const options = {
        member: member,
        content: msg.child("content").val(),
        embeds: msg.child("embeds").val(),
        showEmbed: showEmbed
      }
      const comer = new Welcomer(options)
      const well = await comer.render()
      if (!well) return;
      await channel.send(well)
    })
  }
}