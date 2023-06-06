const { TextInputComponent, MessageActionRow, Modal, MessageButton } = require("discord.js");
const { color, ephemeral } = require(".././../util/util");
module.exports.execute = async function(interaction, client, userId, args) {
  const guild = interaction.guild
  const member = interaction.guild.members.cache.get(interaction.user.id)
  const ruleId = args[2]
  const db =  await client.db.get(guild.id)
  const modlink = db.modlink
  if (interaction.customId.includes("modlink_modal_")) {
    const rule = modlink[modlink.findIndex(c=>c.id === ruleId)]
    const current = rule.link.trim().length != 0 ? rule.link.trim().split(",") : []
    const name = interaction.fields.getTextInputValue('modlink_modal_link_url_input');
    var input = name.trim().replace(/ +/g, "").split(",")
    if (input.length === 0) return interaction.reply(ephemeral("⚠️ URL tidak boleh kosong!"));
    if (interaction.customId.includes("_add")) {
      if(input.some(c=>current.includes(c))) return interaction.reply(ephemeral(`⚠️ Input ${input} Sudah ada.`))
      const merged = [].concat(current,input).filter(c=>c)
      modlink[modlink.findIndex(c => c.id == ruleId)].link = merged.toString();
      await client.db.update(guild.id, { modlink : modlink })
      await interaction.update({
        embeds: [{
          title: "ADD/REMOVE LINK",
          description: `${merged.toString()}`
        }]
      })
    } else {
      const merged = current.length != 0 ? [...new Set([...current.filter(id=> !input.includes(id)),...input.filter(id=>!current.includes(id))])] : [...input]
      if (merged.length <= 0) modlink[modlink.findIndex(c => c.id == ruleId)].link = "";
      if (merged.length > 0) modlink[modlink.findIndex(c => c.id == ruleId)].link = merged.toString();
      await db.child(guild.id).update({modlink:modlink});
      await interaction.update({
        embeds: [{
          title: "ADD/REMOVE LINK",
          description: `\`${merged.length != 0 ? merged.toString() : "Daftar Kosong"}\``
        }]
      })
    }
  } else if(interaction.customId.includes("modlink_button_link_") && interaction.customId.includes("_add")) {
    const modal = new Modal()
    .setCustomId(`modlink_modal_link_${userId}_${ruleId}_add`)
    .setTitle('Add URL')
    .addComponents([
      new MessageActionRow().addComponents(
        new TextInputComponent()
          .setCustomId('modlink_modal_link_url_input')
          .setLabel('URL :')
          .setStyle('SHORT')
          .setPlaceholder('Pisahkan dengan koma www.youtube.com,spotify.com')
          .setRequired(true))
    ]);
    await interaction.showModal(modal);
  } else if (interaction.customId.includes("modlink_button_link_") && interaction.customId.includes("_remove")) {
   const rule = modlink[modlink.findIndex(c=>c.id === ruleId)].link.trim()
   if (rule.length === 0) return interaction.reply(ephemeral(`⚠️ Daftar Kosong.`));
    const modal = new Modal()
    .setCustomId(`modlink_modal_link_${userId}_${ruleId}_remove`)
    .setTitle('Remove URL')
    .addComponents([
      new MessageActionRow().addComponents(
        new TextInputComponent()
          .setCustomId('modlink_modal_link_url_input')
          .setLabel('URL :')
          .setStyle('SHORT')
          .setPlaceholder('Pisahkan dengan koma www.youtube.com,spotify.com')
          .setRequired(true))
    ]);
    await interaction.showModal(modal);
  } else {
   const rule = modlink[modlink.findIndex(c=>c.id === ruleId)]
   const link = rule.link.trim()
   var row = {
      type: 1,
      components: [
        new MessageButton().setCustomId('modlink_button_link_'+userId+"_"+ruleId+"_add").setEmoji("✏️").setLabel("Add").setStyle('PRIMARY'),
        new MessageButton().setCustomId('modlink_button_link_'+userId+"_"+ruleId+"_remove").setEmoji("⛔").setLabel("Remove").setStyle('DANGER'),
        new MessageButton().setCustomId('modlink_button_close_'+userId).setEmoji("❌").setLabel("Tutup").setStyle('DANGER')
      ]
    }
   await interaction.reply({
     embeds: [{
       title: "ADD/REMOVE LINK",
       description: `\`${link.length != 0 ? link : "Daftar Kosong"}\``
     }],
     components: [row]
   })
  }
}