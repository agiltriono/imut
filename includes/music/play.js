const { embeds, clear } = require('.././../util/util');
const { QueryType } = require('discord-player');

module.exports = async function play(message, client, query) {
    await clear(message, 2000)
    const guild = message.guild;
    const member = guild.members.cache.get(message.author.id);
    const me = guild.members.cache.get(client.user.id);
    if (!member.voice.channel) return message.channel.send(embeds('⚠️ **Please join voice terlebih dahulu.**')).then(m => clear(m, 2000));

    if (me.voice.channelId && member.voice.channelId !== me.voice.channelId) return message.channel.send(embeds(`⛔ Kamu gak join di voice <#${me.voice.channelId}> !`)).then(m => clear(m, 2000));

    const searchResult = await client.player.search(query, {requestedBy: member.user, searchEngine: QueryType.AUTO}).catch(() => {});
    if (!searchResult || !searchResult.tracks.length) return message.channel.send(embeds('Tidak ada hasil yang ditemukan!')).then(m => clear(m, 2000));

    const queue = await client.player.createQueue(guild, {
      leaveOnEnd: false,
      leaveOnStop: false,
      leaveOnEmpty: false,
      ytdlOptions: {
        quality: "highest",
        filter: "audioonly",
        highWaterMark: 1 << 30,
        dlChunkSize: 0,
      },
      metadata : message
    });
    
    try {
      if (!queue.connection) await queue.connect(member.voice.channel);
    } catch {
      client.player.deleteQueue(guild.id);
      return message.channel.send(embeds(`⛔ Aku gak bisa join ke voice channel <#${member.voice.channelId}>!`)).then(m=>clear(m, 2000));
    }
    
    searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
    if (!queue.playing) await queue.play();
};
