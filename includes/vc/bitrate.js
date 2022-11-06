const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { database, embeds, ephemeral, color } = require(".././../util/util")
const { getServerBitrate } = require(".././../util/perk")
const db = database.ref("guild")
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
    .setCustomId("imut_vc_selectmenu_bitrate")
    .setPlaceholder(`${value.slice(0, -3)} Bps`)
    .addOptions(option).setDisabled(true));
    await interaction.guild.channels.resolve(voiceChannel.id).setBitrate(parseInt(value))
    await interaction.update(Object.assign({}, ephemeral(`✅ Bitrate untuk ${voiceChannel.name} di ubah ke ${value.slice(0, -3)}bps.`), {components: [menu]}));
  } else {
    if (!voiceChannel) return interaction.reply(ephemeral("⚠️ **Please join voice terlebih dahulu.**"));
    db.child(guild.id).once("value", async (server) => {
      var vc = server.child("voice")
      var temp = vc.child("temp").child(voiceChannel.id)
      if(temp.numChildren() === 0) return interaction.reply(ephemeral(`⛔ Kamu gak join di creator voice **${client.user.username}**!`));
      var owner = temp.child("owner").val()
      if (owner != interaction.user.id) return interaction.reply(ephemeral("⚠️ Akses ditolak! Kamu bukan owner!"));
      return interaction.reply(`Kita sedang update fitur!\n\nCurrent Tier ${intrraction.guild.premiumTier}`)
      const option = await getServerBitrate(parseInt(interaction.guild.premiumTier))
      const menu = new MessageActionRow().addComponents(new MessageSelectMenu()
        .setCustomId("imut_vc_selectmenu_bitrate")
        .setPlaceholder(`Pilih Bitrate`)
        .addOptions(option));
      const custom = {
        embeds: [{
          color: color(),
          description: `**__INFORMATION__**\n\n*Bps (*Bitrate Per-Second*) yang tersedia tergantung dari boost level perks.*`
        }],
        components: [menu],
        ephemeral: true
      }
       await interaction.reply(custom)
    })
  }
}