module.exports = {
  name : "channelDelete",
  async execute(channel, client) {
    const guild = client.guilds.cache.get(channel.guild.id);
    const channelId = channel.id;
    const db = await client.db.get(guild.id);
    const me = guild.members.cache.get(client.user.id);
    const vc = db["voice"]["temp"][channelId]; // temp voice
    if (channel.type === "GUILD_VOICE" || channel.type === "GUILD_STAGE_VOICE") {
      // temp voice
      if(db["voice"]["temp"][channelId]) return client.db.delete([guild.id, "voice", "temp", channelId]);
    }
  }
}
