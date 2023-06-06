const { MessageButton } = require('discord.js');
const { clear } = require('./util');
const fs = require('fs');
const path = require('path');

async function getQueue(guild, client, ch) {
  const queue = await client.player.getQueue(guild.id);
  const msg = queue.metadata;
  const channel = !ch ? msg.channel : ch;
  const check = (current, tracks) => {
    if (tracks.length === 0) return [];
    var arrayList = [...tracks.filter(track => track.id != current.id)]
    if (arrayList.length >= 1) arrayList.reverse();
    return arrayList;
  }
  const render = (track, i) => {
    return `\`${(i)+1}.\` ${track.title} - (\`${track.duration}\`) - <@${track.requestedBy.id}>`;
  }
  
  const trackList = check(queue.current, [...queue.tracks])
  const playlistCount = `🎶 Current Queue | \`${trackList.length ? (trackList.length) + 1 : 1 }\` entries for ${channel.name}`;
  const playlist = trackList.length != 0 ? `${trackList.map(render).join('\n')}\n**__🎶PLAYING NOW__**\n(\`${queue.current.duration}\`) (${queue.current.title}) - <@${queue.current.requestedBy.id}>` : `**__🎶PLAYING NOW__**\n(\`${queue.current.duration}\`) (${queue.current.title}) - <@${queue.current.requestedBy.id}>`;
  return {
    playlist: `${playlistCount}\n\n${playlist}`,
    nowplaying: queue.current
  };
}

async function getThumbnail(thumbnail) {
  const data = await getData();
  if (thumbnail === "" || thumbnail === undefined  || thumbnail === null) return data.music_default_thumbnail;
  const urlArray = thumbnail.split("/").filter(o => o)
  const videoId = urlArray[(urlArray.length) - 2]
  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
}

async function getData() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..','assets','json','music.json')));
}


async function updateData(data) {
  var json = JSON.parse(fs.readFileSync(path.join(__dirname, '..','assets','json','music.json')));
  if (!data) return;
  var combine = Object.assign({}, json, data)
  await fs.writeFileSync(path.join(__dirname, '..','assets','json','music.json'), JSON.stringify(combine));
  return;
}

async function getButton(toggle) {
  /** Player Control
     * 
     * Previous  : <:previousTrack:1043051877522223124>
     * PlayPause : <:playpause:1043052109806977086>
     * Stop      : <:stop:1043052047018237994>
     * Next      : <:nextTrack:1043051654272012318>
     * Loop      : <:loop1:1043051742180409446>
     * 
     **/
  return {
    type: 1,
    components: [
      new MessageButton().setCustomId('uimusic_prev').setEmoji("<:previousTrack:1043051877522223124> ").setStyle('SECONDARY').setDisabled(toggle),
      new MessageButton().setCustomId('uimusic_playpause').setEmoji("<:playpause:1043052109806977086>").setStyle('SECONDARY').setDisabled(toggle),
      new MessageButton().setCustomId('uimusic_stop').setEmoji("<:stop:1043052047018237994>").setStyle('SECONDARY').setDisabled(toggle),
      new MessageButton().setCustomId('uimusic_next').setEmoji("<:nextTrack:1043051654272012318>").setStyle('SECONDARY').setDisabled(toggle),
      new MessageButton().setCustomId('uimusic_loop').setEmoji("<:loop1:1043051742180409446>").setStyle('SECONDARY').setDisabled(toggle)
    ]
  }
}

async function getPlayer(channel) {
  const data = await getData();
  const button = await getButton(true);
  const queueMessage = {
    embeds: [{
      description: `🎶 Current Queue | \`0\` entries for ${channel.name}`,
      color: '#ff9ad1'
    }]
  };
  const playerMessage = {
    embeds : [{
      description: `Join a voice channel and Start Listening to Music, by sending either the **SONG LINK** or **SONG NAME** in this Channel!`,
      image: {
        url: data.music_default_thumbnail
      },
      color: '#ff9ad1'
    }],
    components: [button]
  };
  return {
    queueMessage: queueMessage,
    playerMessage: playerMessage
  }
}

async function updatePlayer(guild, client) {
  const data = await getData();
  const button = await getButton(false);
  const channel = await guild.channels.cache.get(data.music_channel);
  const queueMessage = await channel.messages.fetch(data.music_queue);
  const playerMessage = await channel.messages.fetch(data.music_player);
  const { playlist, nowplaying } = await getQueue(guild, client, channel);
  const thumbnail = await getThumbnail(nowplaying.thumbnail);
  const queueEmbed = [{
    description: playlist,
    color: '#ff9ad1'
  }];
  const playerEmbed = [{
    description: `Join a voice channel and Start Listening to Music, by sending either the **SONG LINK** or **SONG NAME** in this Channel!`,
    image: {
      url: thumbnail
    },
    color: '#ff9ad1'
  }];
  
  await queueMessage.edit({
    embeds: queueEmbed
  });
  
  
  await playerMessage.edit({
    embeds : playerEmbed,
    components: [button]
  })
  
  return;
}

async function setPlayer(guild) {
  const data = await getData();
  const button = await getButton(true);
  const channel = await guild.channels.cache.get(data.music_channel);
  const queueMessage = await channel.messages.fetch(data.music_queue);
  const playerMessage = await channel.messages.fetch(data.music_player);
  const queueEmbed = [{
    description: `🎶 Current Queue | \`0\` entries for ${channel.name}`,
    color: '#ff9ad1'
  }];
  const playerEmbed = [{
    description: `Join a voice channel and Start Listening to Music, by sending either the **SONG LINK** or **SONG NAME** in this Channel!`,
    image: {
      url: data.music_default_thumbnail
    },
    color: '#ff9ad1'
  }];
  
  await queueMessage.edit({
    embeds: queueEmbed
  });
  
  await playerMessage.edit({
    embeds : playerEmbed,
    components: [button]
  })
  
  return;
}

module.exports = {
    getData,
    updateData,
    getQueue,
    getButton,
    getPlayer,
    updatePlayer,
    setPlayer
}