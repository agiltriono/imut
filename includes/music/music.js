const fs = require("fs")
const path = require("path")
module.exports = {
  async music(interaction, client, args) {
    const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file != "music.js");
    const event = require(path.join(__dirname, files[files.findIndex(n=> n === args+".js")]))
    return event.execute(interaction, client);
  }
}