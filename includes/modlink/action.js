const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { color } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const member = interaction.guild.members.cache.get(interaction.user.id)
  const ruleId = args[2]
  const db = await client.db.get(guild.id);
  const modlink = db.modlink;
  if (interaction.customId.includes("modlink_selectmenu_")) {
    const value = interaction.values[0]
    modlink[modlink.findIndex(c=>c.id == ruleId)].action = value
    await client.db.update(guild.id, { modlink : modlink })
    await interaction.update({
      embeds:[{
        color: color(),
        description: `**Action :** \`${value === "allow" ? "Allow" : "Disallow"}\``
      }]
    })
  } else {
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
        emoji: "✅",
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
      components: [menu,tutup]
    })
  }
}