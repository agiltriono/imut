// claim, unlock, lock, hide, unhide, region, limit, trust, block, kick, rename
const fs = require("fs")
const path = require("path")
module.exports = {
  async vc(interaction, client, args) {
    const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file != "vc.js");
    const event = require(path.join(__dirname, files[files.findIndex(n=> n === args+".js")]))
    return event.execute(interaction, client);
  }
}