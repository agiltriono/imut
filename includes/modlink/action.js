const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { database, color } = require(".././../util/util");
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const member = interaction.guild.members.cache.get(interaction.user.id)
  const ruleName = args[2]
  if (interaction.customId.includes("welcomer_selectmenu_")) {
    const value = interaction.values[0]
    await db.child(guild.id).update({ modlink : modlink })
    await interaction.update({
      embeds:[{
        color: color(),
        description: `**Action :** \`${value === "allow" ? "Allow" : "Disallow"}\``
      }],
      components:[]
    })
  } else {
    await interaction.deferReply({ephemeral:true})
    db.child(guild.id).once("value", async(s) => {
      const modlink = [...s.child("modlink").val()]
      const action = modlink[modlink.findIndex(c=>c.name == ruleName)].action.trim()
      var option = [
        {
          label: "Allow",
          value: "allow",
          description: "Link pada daftar tidak akan di hapus."
        },
        {
          label: "Disallow",
          value: "disallow",
          description: "Link pada daftar akan di jadikan pengecualian."
        }
      ]
      const menu = new MessageActionRow().addComponents(new MessageSelectMenu()
        .setCustomId(`modlink_selectmenu_action_${userId}_${ruleName}`)
        .setPlaceholder(`Pilih Action`)
        .addOptions(option));
      await interaction.reply({
        embeds : [{
          color: color(),
          description: `**Action :** \`${action.length != 0 ? action == "allow" ? "Allow" : "Disallow" : "NONE"}\``
        }],
        components: [menu]
      })
    })
  }
}