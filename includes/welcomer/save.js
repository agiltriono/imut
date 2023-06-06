const { ephemeral } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const content = interaction.message.content
  const embed = interaction.message.embeds
  if (content.length === 0 && embed.length === 0) return interaction.reply(ephemeral("❌ ELement tidak boleh kosong."));
  await client.db.update([guild.id, "wc", "m"], {
    content: content ||  null,
    embeds: embed
  });
  await interaction.reply(ephemeral("✅ Pengaturan berhasil di simpan.\nKlik tombol **Test** untuk melihat pratinjau.\nKlik **Tutup** untuk menutup pengaturan."))
}
