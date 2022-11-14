const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { database, color } = require(".././../util/util");
const db = database.ref("guild")
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const member = interaction.guild.members.cache.get(interaction.user.id)
  const ruleId = args[2]
  if (interaction.customId.includes("modlink_selectmenu_")) {
    db.child(guild.id).once("value", async(s) => {
      const modlink = [...s.child("modlink").val()]
      const value = interaction.values[0]
      modlink[modlink.findIndex(c=>c.id == ruleId)].action = value
      await db.child(guild.id).update({ modlink : modlink })
      await interaction.update({
        embeds:[{
          color: color(),
          description: `**Action :** \`${value === "allow" ? "Allow" : "Disallow"}\``
        }]
      })
    })
  } else {
    db.child(guild.id).once("value", async(s) => {
      const modlink = [...s.child("modlink").val()]
      const action = modlink[modlink.findIndex(c=>c.id == ruleId)].action.trim()
      var tutup = {
        type: 1,
        components: [
          new MessageButton().setCustomId('modlink_button_close_'+userId).setEmoji("❌").setLabel("Tutup").setStyle('DANGER')
        ]
      }
      const menu = new MessageActionRow().addComponents(new MessageSelectMenu()
        .setCustomId(`modlink_selectmenu_action_${userId}_${ruleId}`)
        .setPlaceholder(`Pilih Action`)
        .addOptions([
        {
          label: "Allow",
          value: "allow",
          emojo: "✅",
          description: "Link pada daftar tidak akan di hapus."
        },
        {
          label: "Disallow",
          value: "disallow",
          emoji: "🚫",
          description: "Link pada daftar akan di jadikan pengecualian."
        }
      ]));
      await interaction.reply({
        embeds : [{
          color: color(),
          description: `**Action :** \`${action.length != 0 ? action == "allow" ? "Allow" : "Disallow" : "NONE"}\``
        }],
        components: [tutup,menu]
      })
    })
  }
}