const recreate = require("./recreate")
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const ruleId = args[2]
  const db =  await client.db.get(guild.id)
  const modlink = db.modlink
  const array = modlink.filter(c=>c.id != ruleId)
  await client.db.update(guild.id, { modlink : array })
  return recreate(interaction, client, userId)
}