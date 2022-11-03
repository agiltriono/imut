const fs = require("fs")
const path = require("path")
const { ephemeral } = require(".././../util/util")
module.exports = {
  async welcomer(interaction, client, args) {
    const userId = args.split("_")[1]
  if (interaction.user.id != userId) return interaction.reply(ephemeral("⚠️ Maaf, tapi kamu gak ada izin untuk itu."));
    const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file != "welcomer.js");
    const event = require(path.join(__dirname, files[files.findIndex(n=> n === args.split("_")[0]+".js")]))
    return event.execute(interaction, client, userId);
  }
}