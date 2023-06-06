module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
  /*
    if(oldState.channelID === newState.channelID) {
        console.log('a user has not moved!')
    }
    if(oldState.channelID != null && newState.channelID != null && newState.channelID != oldState.channelID) {
        console.log('a user switched channels')
    }
    if(oldState.channelID === null) {
        console.log('a user joined!')
    }
    if (newState.channelID === null) {
        console.log('a user left!')
    }
  */
    const db = await client.db.get(newState.guild.id)
    const oldChannel = oldState.channel;
    const oldChannelId = oldState.channelId;
    const member = newState.member;
    const guild = newState.guild;
    const newChannel = newState.channel;
    const newChannelId = newState.channelId;
    const queue = client.player.getQueue(guild.id);
    const vc = db["voice"];
    const mainChannel = vc["creator"];
    const temp = vc["temp"];
    // NEW User Want Join Creator Channel
    if (newChannelId && newChannelId === mainChannel) {
      // Create Channel
      const main = guild.channels.cache.get(mainChannel)
      const channel = await guild.channels.create(
          `${member.user.username}`,
          {
            type: 'GUILD_VOICE', 
            parent: main.parent
          }
      );
      await channel.permissionOverwrites.set(main.permissionOverwrites.cache)
      await channel.permissionOverwrites.create(member.user.id, {
        "VIEW_CHANNEL": true,
        "MANAGE_CHANNELS": true,
        "MANAGE_ROLES": true,
        "CONNECT": true,
        "SEND_MESSAGES": true,
        "READ_MESSAGE_HISTORY": true,
        "ADD_REACTIONS": true,
        "EMBED_LINKS": true,
        "ATTACH_FILES": true,
        "USE_EXTERNAL_EMOJIS": true,
        "USE_APPLICATION_COMMANDS": true,
        "SEND_TTS_MESSAGES": true
      })
      // Add the channel id to the array of temporary channel ids.
      await client.db.update([guild.id, "voice", "temp", channel.id], {
        owner: member.user.id,
        trust: "",
        block: "",
        ghost: false
      })
      // Move the member to the new channel.
      await newState.setChannel(channel);
      return;
    }
    
    // Bot leave or disconnected from music channel
    if (!newChannelId && member.id === client.user.id && queue) {
      return client.player.emit('botDisconnect', queue);
    }
    
    // User switch or disconnected or delete temporary channel
    if (oldChannelId && oldChannelId != newChannelId && temp[oldChannelId]) {
      const channel = await guild.channels.resolve(oldChannelId);
      const memberCount = channel.members.filter(member=> !member.user.bot).size;
      if (memberCount === 0) {
        // Delete the channel
        await channel.delete();
        //await db.child(guild.id).child("voice").child("temp").child(oldChannelId).remove()
        return;
      } else {
        // delete permission
        const owner = temp[oldChannelId]["owner"];
        const trusted = temp[oldChannelId]["trust"];
        const blocked = temp[oldChannelId]["block"];
        const isTrusted = trusted ? trusted.trim().split(",") : []
        const isBlocked = blocked ? blocked.trim().split(",") : []
        const permit = channel.permissionOverwrites.cache.get(member.user.id);
        if (member.user.id === owner) return;
        if (isBlocked.includes(member.user.id)) return;
        if (isTrusted.includes(member.user.id)) return;
        if (permit) await permit.delete();
      }
    }
    // NEW User Join Temporary Voice Channel
    if(!oldState.channelID && temp[newChannelId]) {
      const channel = await guild.channels.resolve(newChannelId)
      const owner = temp[newChannelId]["owner"];
      const trusted = temp[newChannelId]["trust"];
      const blocked = temp[newChannelId]["block"];
      const isTrusted = trusted ? trusted.trim().split(",") : []
      const isBlocked = blocked ? blocked.trim().split(",") : []
      if (isBlocked.includes(member.user.id)) return;
      if (isTrusted.includes(member.user.id)) return;
      if (member.user.id != owner) await channel.permissionOverwrites.create(member.user.id, {
        "SEND_MESSAGES": true,
        "READ_MESSAGE_HISTORY": true,
        "ADD_REACTIONS": true,
        "EMBED_LINKS": true,
        "ATTACH_FILES": true,
        "USE_EXTERNAL_EMOJIS": true,
        "USE_APPLICATION_COMMANDS": true,
        "SEND_TTS_MESSAGES": true
      })
    }
  }
}