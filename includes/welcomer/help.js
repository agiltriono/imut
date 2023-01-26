const { ephemeral } = require(".././../util/util")
module.exports.execute = async function(interaction, client, userId) {
  await interaction.reply(ephemeral("**__Bantuan__**\n\n**{member}** : Mention Member.\n**{memberCount}** : Tampilkan jumlah member.\n**{server}** : Tampilkan nama server.\n**Test** : Lihat pratinjau Welcomer.\n**Tutup** : Untuk menutup pengaturan."))
}