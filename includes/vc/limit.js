const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");
const { embeds, ephemeral } = require(".././../util/util")
module.exports.execute = async function(interaction, client) {
  // voice > temp > userId
  const guild = interaction.guild
  const member = guild.members.cache.get(interaction.user.id);
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) return interaction.reply(ephemeral("⚠️ **Please join voice terlebih dahulu.**"));
  const db = await client.db.get(guild.id);
  const vc = db.voice
  const temp = vc.temp[voiceChannel.id]
  if (interaction.customId.includes("imut_vc_modal_")) {
    const field = interaction.fields
    const value = field.getTextInputValue('imut_vc_modal_limit_input');
    if(parseInt(value) < 0) return interaction.reply(ephemeral("⚠️ Limit di bawah batas minimum!"));
    if(parseInt(value) > 99) return interaction.reply(ephemeral("⚠️ Limit melebihi batas maksimal!"));
    const channel = await interaction.guild.channels.resolve(voiceChannel.id)
    await channel.setUserLimit(parseInt(value))
    return interaction.reply(ephemeral(`✅  Channel limit **${value}** member.`));
  } else {
    if(!temp) return interaction.reply(ephemeral(`⛔ Kamu gak join di creator voice **${client.user.username}**!`));
    var owner = temp.owner
    if (owner != interaction.user.id) return interaction.reply(ephemeral("⚠️ Akses ditolak! Kamu bukan owner!"));
    const modal = new Modal()
        .setCustomId('imut_vc_modal_limit')
        .setTitle('Edit Limit Channel')
        .addComponents([
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('imut_vc_modal_limit_input')
              .setLabel('Akses Limit 0 - 99')
              .setStyle('SHORT')
              .setMinLength(1)
              .setMaxLength(2)
              .setPlaceholder('Masukan Jumlah..')
              .setRequired(true)
          )
        ]);
      await interaction.showModal(modal);
  }
}
