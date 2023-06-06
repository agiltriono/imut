const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { embeds, ephemeral, color } = require(".././../util/util")
module.exports.execute = async function(interaction, client) {
  // voice > temp > userId
  const guild = interaction.guild
  const member = guild.members.cache.get(interaction.user.id);
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) return interaction.reply(ephemeral("⚠️ **Please join voice terlebih dahulu.**"));
  const db = await client.db.get(guild.id);
  const vc = db.voice
  const temp = vc.temp[voiceChannel.id]
  if (interaction.customId.includes("imut_vc_selectmenu_")) {
    const args = interaction.customId.replace("imut_vc_selectmenu_",'').split('_')
    const selected = (def, dyn) => {
      return dyn == def ? `Daftar Member ${dyn} Dipilih` : `Daftar Member ${dyn}`
    }
    const value = interaction.values[0]
    var oldcomp = interaction.message.components
    const staff = guild.members.cache.get(value);
    if (staff.permissions.has("ADMINISTRATOR") || staff.permissions.has("MANAGE_GUILD") || staff.user.id === interaction.guild.ownerId) return interaction.update(Object.assign({}, ephemeral(`✅ Selesai!`), {components:[]}))
    var comp = [
      new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("imut_vc_selectmenu_unblock_1").setPlaceholder(selected(1,args[1])).addOptions([{label:"none1",value:"none1"}]).setDisabled(true)),
      new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("imut_vc_selectmenu_unblock_2").setPlaceholder(selected(2,args[1])).addOptions([{label:"none2",value:"none2"}]).setDisabled(true)),
      new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("imut_vc_selectmenu_unblock_3").setPlaceholder(selected(3,args[1])).addOptions([{label:"none3",value:"none3"}]).setDisabled(true)),
      new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("imut_vc_selectmenu_unblock_4").setPlaceholder(selected(4,args[1])).addOptions([{label:"none4",value:"none4"}]).setDisabled(true)),
      new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("imut_vc_selectmenu_unblock_5").setPlaceholder(selected(5,args[1])).addOptions([{label:"none5",value:"none5"}]).setDisabled(true))
    ]
    var menu = comp.splice(0, oldcomp.length)
    
    let blocked = temp.block
    let array = blocked.trim().split(",")
    let result = array.filter(u=>u != value)
    let channel = guild.channels.resolve(voiceChannel.id)
    await channel.permissionOverwrites.cache.get(value).delete()
    await client.db.update([guild.id, "voice", "temp", voiceChannel.id], {block:result.toString()});
    await interaction.update(Object.assign(ephemeral(`✅ Berhasil menghapus <@${value}> dari daftar Blocked Member pada channel ${voiceChannel.name}`), {components: menu }))
  } else {
    await interaction.deferReply({ephemeral:true})
    if(!temp) return interaction.editReply(ephemeral(`⛔ Kamu gak join di creator voice **${client.user.username}**!`));
    var owner = temp.owner
    if (owner != interaction.user.id) return interaction.editReply(ephemeral("⚠️ Akses ditolak! Kamu bukan owner!"));
    var ghost = temp.ghost
    if (ghost == true) return interaction.editReply(ephemeral(`⚠️ Tidak dapat menggunakan **UNBLOCK** ketika channel dalam keadaan tersembunyi, Gunakan **UNHIDE** terlebih dahulu.`));
    var blocked = temp.block
    if(!blocked) return interaction.editReply(ephemeral(`⚠️ Daftar Blocked Member saat ini kosong.`));
    var cache = guild.members.cache
    var attendance = blocked.trim().split(",")
    var array = attendance.map((i)=> {
      return {
        label:cache.get(i).user.username,
        value:i.toString()
      }
    })
    var option = array
    if (option.length > 25) {
      const menu = await chunk(option, 25);
      const custom = {
        embeds: [{
          color: color(),
          description: `⚠️ Member terpilih akan dihapus termasuk permit untuk bergabung pada **${voiceChannel.name}**`
        }],
        components: menu,
        ephemeral: true
      }
      await interaction.editReply(custom)
    } else {
      const menu = new MessageActionRow().addComponents(new MessageSelectMenu()
        .setCustomId("imut_vc_selectmenu_unblock_1")
        .setPlaceholder(`Daftar Member 1`)
        .addOptions(option));
      const custom = {
        embeds: [{
          color: color(),
          description: `⚠️ Member terpilih akan dihapus termasuk permit untuk bergabung pada **${voiceChannel.name}**`
        }],
        components: [menu],
        ephemeral: true
      }
      await interaction.editReply(custom)
    }
  }
}
async function chunk(obj, i) {
  let chunks = [];
  let count = 0
  while(obj.length){
    count++;
    chunks.push(new MessageActionRow().addComponents(new MessageSelectMenu()
    .setCustomId(`imut_vc_selectmenu_unblock_${count}`)
    .setPlaceholder(`Daftar Member ${count}`)
    .addOptions(obj.splice(0,i))));
  }
  return chunks;
}
