const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { embeds, ephemeral, color } = require(".././../util/util");
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
    const value = interaction.values
    var oldcomp = interaction.message.components
    const staff = guild.members.cache.get(value[0]);
    if (staff.permissions.has("ADMINISTRATOR") || staff.permissions.has("MANAGE_GUILD") || staff.user.id === interaction.guild.ownerId) return interaction.update(Object.assign({}, ephemeral(`✅ Selesai!`), {components:[]}))
    var comp = [
      new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("imut_vc_selectmenu_trust_1").setPlaceholder(selected(1,args[1])).addOptions([{label:"none1",value:"none1"}]).setDisabled(true)),
      new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("imut_vc_selectmenu_trust_2").setPlaceholder(selected(2,args[1])).addOptions([{label:"none2",value:"none2"}]).setDisabled(true)),
      new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("imut_vc_selectmenu_trust_3").setPlaceholder(selected(3,args[1])).addOptions([{label:"none3",value:"none3"}]).setDisabled(true)),
      new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("imut_vc_selectmenu_trust_4").setPlaceholder(selected(4,args[1])).addOptions([{label:"none4",value:"none4"}]).setDisabled(true)),
      new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("imut_vc_selectmenu_trust_5").setPlaceholder(selected(5,args[1])).addOptions([{label:"none5",value:"none5"}]).setDisabled(true))
    ]
    var menu = comp.splice(0, oldcomp.length)
    
    let trusted = temp.trust
    let array = trusted ? trusted.trim().split(",") : []
    let result = [].concat(array, value)
    let channel = guild.channels.resolve(voiceChannel.id)
    await channel.permissionOverwrites.create(value[0],{
      "VIEW_CHANNEL": true,
      "CONNECT": true,
      "SEND_MESSAGES": true,
      "READ_MESSAGE_HISTORY": true,
      "ADD_REACTIONS": true,
      "EMBED_LINKS": true,
      "ATTACH_FILES": true,
      "USE_EXTERNAL_EMOJIS": true,
      "USE_APPLICATION_COMMANDS": true,
      "SEND_TTS_MESSAGES": true
    })
   
    await client.db.update([guild.id, "voice", "temp", voiceChannel.id], {trust:result.toString()})
    await interaction.update(Object.assign(ephemeral(`🛡 Trusted Member Channel ${voiceChannel.name}\n\n${result.map(u=>`<@${u}>`).join("\n")}`), {components: menu }))
  } else {
    await interaction.deferReply({ephemeral:true})
    var trusted = temp.trust
    var blocked = temp.block
    if (!temp) return interaction.editReply(ephemeral(`⛔ Kamu gak join di creator voice **${client.user.username}**!`));
    var owner = temp.owner
    if (owner != interaction.user.id) return interaction.editReply(ephemeral("⚠️ Akses ditolak! Kamu bukan owner!"));
    var ghost = temp.ghost
    if (ghost == true) return interaction.editReply(ephemeral(`⚠️ Tidak dapat menggunakan **TRUST** ketika channel dalam keadaan tersembunyi, Gunakan **UNHIDE** terlebih dahulu.`));
    var isTrusted = trusted ? trusted.trim().split(",") : []
    var isBlocked = blocked ? blocked.trim().split(",") : []
    var isEmpty = voiceChannel.members.filter(member=> member.user.id != interaction.user.id)
    if (isEmpty.size === 0) return interaction.editReply(ephemeral(`⚠️ Member tidak tersedia saat ini.`));
    var user = voiceChannel.members.filter(member=> !isTrusted.includes(member.user.id) && !isBlocked.includes(member.user.id) && member.user.id != interaction.user.id)
    if (user.size === 0) return interaction.editReply(ephemeral(`⚠️ Member tidak tersedia lagi coba gunakan *untrust* atau *unblock*.`));
    const option = user.map(member=> {
      return {
        label: member.user.username,
        value: member.user.id.toString()
      }
    })
    
    if (option.length > 25) {
      const menu = await chunk(option, 25);
      const custom = {
        embeds: [{
          color: color(),
          description: `⚠️ Member terpilih dapat melihat dan bergabung pada **${voiceChannel.name}**`
        }],
        components: menu,
        ephemeral: true
      }
      await interaction.editReply(custom)
    } else {
      const menu = new MessageActionRow().addComponents(new MessageSelectMenu()
        .setCustomId("imut_vc_selectmenu_trust_1")
        .setPlaceholder(`Daftar Member 1`)
        .addOptions(option));
      const custom = {
        embeds: [{
          color: color(),
          description: `⚠️ Member terpilih dapat melihat dan bergabung pada **${voiceChannel.name}**`
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
    .setCustomId(`imut_vc_selectmenu_trust_${count}`)
    .setPlaceholder(`Daftar Member ${count}`)
    .addOptions(obj.splice(0,i))));
  }
  return chunks;
}
