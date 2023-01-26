const { database, ephemeral } = require(".././../util/util")
const { TextInputComponent, MessageActionRow, Modal, MessageButton } = require("discord.js");
const db = database.ref("guild");
module.exports.execute = async function(interaction, client, userId) {
  const guild = interaction.guild
  const member = guild.members.cache.get(interaction.user.id)
  if (interaction.customId.includes("modlink_modal")) {
    db.child(guild.id).once("value", async (server) => {
      var modlink = server.child("modlink").exists() ? [...server.child('modlink').val()] : []
      const input = interaction.fields.getTextInputValue('modlink_modal_create_name_input');
      // Fix Random Id
      const date = Date.now()
      const init = {
        name: input,
        id: `rule-${date}`,
        link: "",
        channel: "",
        action: "",
        createdAt: date,
        createdBy: member.user.id,
      }
      modlink.push(init)
      const ruleId = init.id
      var row1 = {
        type: 1,
        components: [
          new MessageButton().setCustomId('modlink_button_link_'+userId+"_"+ruleId).setEmoji("🔗").setLabel("Link").setStyle('PRIMARY'),
          new MessageButton().setCustomId('modlink_button_action_'+userId+"_"+ruleId).setEmoji("🛡").setLabel("Action").setStyle('PRIMARY'),
          new MessageButton().setCustomId('modlink_button_channel_'+userId+"_"+ruleId).setEmoji("💬").setLabel("Channel").setStyle('PRIMARY')
        ]
      }
      var row2 = {
        type:1,
        components: [
          new MessageButton().setCustomId('modlink_button_delete_'+userId+"_"+ruleId).setLabel("Hapus").setEmoji("🗑").setStyle('DANGER'),
          new MessageButton().setCustomId('modlink_button_close_'+userId+"_"+ruleId).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
        ]
      }
      await db.child(guild.id).update({modlink:modlink})
      await interaction.update({
        embeds: [{ 
          title: "LINK REMOVER PANEL",
          description: `**Rule Name :**\n${init.name}\n**Created At :**\n${new Date(parseInt(init.createdAt)).toLocaleString("id-ID", {timeZone: "Asia/Jakarta"})}\n**Created By :**\n<@${init.createdBy}>`
        }],
        components: [row1,row2]
      })
    })
  } else {
    db.child(guild.id).once("value", async (server) => {
      const modlink = server.child("modlink").exists() ? [...server.child("modlink").val()] : []
      if(modlink.length === 100) return interaction.reply(ephemeral("⚠️ Link tercapai."));
      const modal = new Modal()
        .setCustomId('modlink_modal_create_'+userId)
        .setTitle('New Rule')
        .addComponents([
          new MessageActionRow().addComponents(
            new TextInputComponent()
              .setCustomId('modlink_modal_create_name_input')
              .setLabel('Nama Rule:')
              .setStyle('SHORT')
              .setPlaceholder('contoh : General Rule')
              .setRequired(true))
        ]);
      await interaction.showModal(modal);
    })
  }
}