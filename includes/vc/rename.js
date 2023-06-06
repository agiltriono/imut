const { MessageActionRow, MessageButton, Modal, TextInputComponent } = require("discord.js");
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
    const value = field.getTextInputValue('imut_vc_modal_rename_input');
    const channel = await interaction.guild.channels.resolve(voiceChannel.id)
    await channel.setName(value)
    return interaction.reply(ephemeral(`✅ Nama berhasil diganti ke **${value}**`));
  } else {
    if(!temp) return interaction.reply(ephemeral(`⛔ Kamu gak join di creator voice **${client.user.username}**!`));
    var owner = temp.owner
    if (owner != interaction.user.id) return interaction.reply(ephemeral("⚠️ Akses ditolak! Kamu bukan owner!"));
    const modal = new Modal()
    .setCustomId('imut_vc_modal_rename')
    .setTitle('Edit Nama Channel')
    .addComponents([
      new MessageActionRow().addComponents(
        new TextInputComponent()
          .setCustomId('imut_vc_modal_rename_input')
          .setLabel('Nama Channel')
          .setStyle('SHORT')
          .setMinLength(2)
          .setMaxLength(30)
          .setPlaceholder('Masukan Nama Baru..')
          .setRequired(true)
      )
    ]);
    await interaction.showModal(modal);
  }
}
