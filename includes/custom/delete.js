const { database } = require(".././../util/util")
const recreate = require("./recreate")
const db = database.ref("guild");
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const commandName = args[2]
  db.child(guild.id).once("value", async (server) => {
    const cc = server.child("cc").exists() ? [...server.child("cc").val()] : []
    const array = cc.filter(c=>c.name != commandName)
    if (array.length === 0) {
      await db.child(guild.id).child("cc").remove();
      return recreate(interaction, client, userId)
    } else {
      await db.child(guild.id).update({cc:array})
      return recreate(interaction, client, userId)
    }
  })
}