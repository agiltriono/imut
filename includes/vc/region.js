const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { database, embeds, ephemeral, color } = require(".././../util/util")
//const { getServerBitrate } = require(".././../util/perk")
const db = database.ref("guild")
const regions = [
  { label: "Brazil", value: "brazil", emoji: "🇧🇷" },
  { label: "Hong Kong", value: "hongkong", emoji: "🇭🇰" },
  { label: "India", value: "india", emoji: "🇮🇳" },
  { label: "Japan", value: "japan", emoji: "🇯🇵" },
  { label: "Rotterdam", value: "rotterdam", emoji: "🇳🇱" },
  { label: "Russia", value: "russia", emoji: "🇷🇺" },
  { label: "Singapore", value: "singapore", emoji: "🇸🇬" },
  { label: "South Africa", value: "southafrica", emoji: "🇿🇦" },
  { label: "Sydney", value: "sydney", emoji: "🇦🇺" },
  { label: "US Central", value: "us-central", emoji: "🇺🇸" },
  { label: "US East", value: "us-east", emoji: "🇺🇸" },
  { label: "US West", value: "us-west", emoji: "🇺🇸" },
  { label: "US South", value: "us-south", emoji: "🇺🇸" }
]
module.exports.execute = async function(interaction, client) {
  // voice > temp > userId
  const guild = interaction.guild
  const member = guild.members.cache.get(interaction.user.id);
  const voiceChannel = member.voice.channel;
  if (interaction.customId.includes("imut_vc_selectmenu_")) {
    const value = interaction.values[0]
    const option = [{
      label: "none",
      value: "none"
    }]
    const menu = new MessageActionRow().addComponents(new MessageSelectMenu()
    .setCustomId("imut_vc_selectmenu_region")
    .setPlaceholder(`${regions.filter(c=>c.value === value).map(c=>`${c.label}`)}`)
    .addOptions(option).setDisabled(true));
    await interaction.guild.channels.resolve(voiceChannel.id).setRTCRegion(value)
    await interaction.update(Object.assign({}, ephemeral(`✅ Voice Region untuk **${voiceChannel.name}** di ubah ke ${regions.filter(c=>c.value === value).map(c=>`${c.emoji} **${c.label}**`)}.`), {components: [menu]}));
  } else {
    if (!voiceChannel) return interaction.reply(ephemeral("⚠️ **Please join voice terlebih dahulu.**"));
    db.child(guild.id).once("value", async (server) => {
      var vc = server.child("voice")
      var temp = vc.child("temp").child(voiceChannel.id)
      if(temp.numChildren() === 0) return interaction.reply(ephemeral(`⛔ Kamu gak join di creator voice **${client.user.username}**!`));
      var owner = temp.child("owner").val()
      if (owner != interaction.user.id) return interaction.reply(ephemeral("⚠️ Akses ditolak! Kamu bukan owner!"));
      const option = regions;
      const menu = new MessageActionRow().addComponents(new MessageSelectMenu()
        .setCustomId("imut_vc_selectmenu_region")
        .setPlaceholder(`Pilih Region`)
        .addOptions(option));
      const custom = {
        embeds: [{
          color: color(),
          description : `**__Region List__**\n${regions.map(c=>`${c.emoji} : **${c.label}**`).join("\n")}`,
        }],
        components: [menu],
        ephemeral: true
      }
       await interaction.reply(custom)
    })
  }
}