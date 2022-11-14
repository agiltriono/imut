const { database } = require(".././../util/util")
const recreate = require("./recreate")
const db = database.ref("guild");
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const ruleName = args[2]
  db.child(guild.id).once("value", async (server) => {
    const modlink = server.child("modlink").exists() ? [...server.child("modlink").val()] : []
    const array = modlink.filter(c=>c.name != ruleName)
    if (array.length === 0) {
      await db.child(guild.id).child("modlink").remove();
      return recreate(interaction, client, userId)
    } else {
      await db.child(guild.id).update({modlink:array})
      return recreate(interaction, client, userId)
    }
  })
}