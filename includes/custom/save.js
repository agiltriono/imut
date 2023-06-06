const { embeds } = require(".././../util/util");
const { MessageButton } = require("discord.js");
module.exports.execute = async function(interaction, client, userId, args) {
  await interaction.deferReply();
  const guild = interaction.guild;
  const commandName = args[2];
  const db = await client.db.get(guild.id);
  const cc = db.cc;
  const command = cc[cc.findIndex(c=>c.name === commandName)].type;
  const embed = interaction.message.embeds;
  const content = interaction.message.content;
  var row = {
    type: 1,
    components: [
      new MessageButton().setCustomId('cc_button_close_'+userId).setLabel("Dismis").setEmoji("🗑").setStyle('DANGER')
    ]
  }
  
  if (content.length) cc[cc.findIndex(c=>c.name === commandName)].content = content;
  if (embed.length) cc[cc.findIndex(c=>c.name === commandName)].embed = embed[0];
  
  await client.db.update(guild.id, {cc:cc})
  await interaction.editReply(Object.assign({},embeds(`✅ Command **${commandName}** telah di record.\nJangan lupa untuk menutup pengaturan.`), {components: [row]}));
}