const { database } = require(".././../util/util")
const db = database.ref("guild");
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  db.child(guild.id).once("value", async (s)=> {
    const wc = s.child("gb").child("m")
    if (wc.exists()) await db.child(guild.id).child("gb").child("m").remove();
    await interaction.update({content: null,embeds:[]})
  })
}