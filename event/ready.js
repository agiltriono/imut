const fs = require("fs");
const path = require("path");
module.exports = {
  name : "ready",
  async execute(client) {
    const directory = path.join(__dirname, "..","commands");
    
    // Presence
    client.user.setActivity(`discord.gg/imutserver`, { type: "WATCHING", url: "https://discord.gg/imutserver" });
    /*let num = 0;
    interval = setInterval(() => {
        num++;
        if (num == 1) {
            client.user.setActivity(`discord.gg/imutserver`, { type: "PLAYING", url: "https://discord.gg/imutserver" });
        }
        if (num == 2) {
            client.user.setActivity(`discord.gg/imutserver`, { type: "LISTENING", url: "https://discord.gg/imutserver" });
        }
        if (num == 3) {
            client.user.setActivity(`discord.gg/imutserver`, { type: "WATCHING", url: "https://discord.gg/imutserver" });
        }
        if (num == 4) {
            client.user.setActivity(`discord.gg/imutserver`, { type: "STREAMING", url: "https://discord.gg/imutserver" });
            num = 0;
        }
    }, 20000);*/

    // command handler
    fs.readdirSync(directory).forEach(child => {
        const commands = fs.readdirSync(`${directory}/${child}/`).filter(files => files.endsWith(".js"));
        for (const file of commands) {
            const cmd = require(`${directory}/${child}/${file}`);
            if (cmd.help && typeof (cmd.help.name) === "string" && typeof (cmd.help.category) === "string") {
                if (client.commands.get(cmd.help.name)) return;
                client.commands.set(cmd.help.name, cmd);
            } else {
                continue;
            }
            if (cmd.help.aliases && typeof (cmd.help.aliases) === "object") {
                cmd.help.aliases.forEach(alias => {
                        if (client.aliases.get(alias)) return;
                    client.aliases.set(alias, cmd.help.name);
                });
            }
        }
    })
    console.log(`Bot running..`)
  }
}