const { database, ephemeral } = require(".././../util/util")
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const content = interaction.message.content
  const embed = interaction.message.embeds
  if (content.length === 0 && embed.length === 0) return interaction.reply(ephemeral("❌ Content Atau Deskripsi tidak boleh kosong."));
  if (content.length && embed.length) await db.child(guild.id).child("wc").child("m").set({
    content: content,
    embeds: embed[0]
  });
  if (content.length == 0 && embed.length != 0) await db.child(guild.id).child("wc").child("m").set({
    embeds: embed[0]
  });
  if(content.length != 0 && embed.length === 0) await db.child(guild.id).child("wc").child("m").set({
    embeds: embed[0]
  });
  await interaction.reply(ephemeral("✅ Pengaturan berhasil di simpan.\nKlik tombol **Test** untuk melihat pratinjau.\nKlik **Tutup** untuk menutup pengaturan."))
}