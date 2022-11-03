const { database, ephemeral } = require(".././../util/util")
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const json = interaction.message.embeds[0]
  await db.child(guild.id).child("gb").update({embed:json}) 
  await interaction.reply(ephemeral("✅ Pengaturan berhasil di simpan.\nKlik tombol **Test** untuk melihat pratinjau.\nKlik **Tutup** untuk menutup pengaturan."))
}