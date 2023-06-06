const recreate = require("./recreate")
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild;
  const commandName = args[2];
  const db = await client.db.get(guild.id);
  const cc = db.cc;
  const array = cc.filter(c=>c.name != commandName);
  await client.db.update(guild.id, {cc:array})
  return recreate(interaction, client, userId)
}