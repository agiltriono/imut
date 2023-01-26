const { database, embeds, getmsg, clear, remove, color } = require(".././../util/util"); 
const db = database.ref("guild");
const { MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
module.exports.help = {
    name: "custom-command",
    aliases: ["cc"],
    usage:"",
    category: "Custom Command",
    permissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    description: "Buat atau Edit CC (Custom Command)"
}

module.exports.run = async function(msg, args, creator, prefix) {
  await msg.delete()
  const permis = [
    (msg.member.permissions.has("ADMINISTRATOR")),
    (msg.member.permissions.has("MANAGE_GUILD")),
    (creator.id === msg.guild.ownerId)
  ].filter(u=>u.toString() != "false")
  if(permis.length === 0) return;
  // ID_CHANNEL
  if (!msg.guild.me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
  const guild = msg.guild
  db.child(guild.id).once("value", async (server) => {
    var cc = server.child("cc")
    var notlimited = {
      type: 1,
      components: [
        new MessageButton().setCustomId('cc_button_create_'+creator.id).setEmoji("📝").setLabel("Create New").setStyle('PRIMARY'),
        new MessageButton().setCustomId('cc_button_close_'+creator.id).setEmoji("❌").setLabel("Tutup").setStyle('DANGER'),
      ]
    }
    var limited = {
      type: 1,
      components: [
        new MessageButton().setCustomId('cc_button_create_'+creator.id).setEmoji("📝").setLabel("Create New").setStyle('PRIMARY').setDisabled(true),
        new MessageButton().setCustomId('cc_button_close_'+creator.id).setEmoji("❌").setLabel("Tutup").setStyle('DANGER'),
      ]
    }
    if (cc.exists()) {
      const array = cc.val()
      const option = array.map((e,i)=> {
        return {
          label: e.name,
          value: `${e.name}`
        }
      })
      if (option.length > 25 || option.length === 100) {
        const button = option.length == 100 ? limited : notlimited
        const array = await chunk(option, 25)
        const custom = {
          embeds: [{
            color: color(),
            description: `**__Custom Command__** = ${array.length}`
          }],
          components: [button, array]
        }
        await msg.channel.send(custom)
      } else {
        const button = option.length == 100 ? limited : notlimited
        const menu = new MessageActionRow().addComponents(new MessageSelectMenu()
          .setCustomId(`cc_selectmenu_edit_${creator.id}_1`)
          .setPlaceholder(`Edit Command`)
          .addOptions(option));
        const custom = {
          embeds: [{
            color: color(),
            description: `**__Custom Command__** = ${array.length}`
          }],
          components: [button, menu]
        }
        await msg.channel.send(custom)
      }
    } else {
      const custom = {
        embeds: [{
          color: color(),
          description: `**__Custom Command__** = 0`
        }],
        components: [notlimited]
      }
      await msg.channel.send(custom)
    }
  })
}
async function chunk(obj, i) {
  let chunks = [];
  let count = 0
  while(obj.length){
    count++;
    chunks.push(new MessageActionRow().addComponents(new MessageSelectMenu()
    .setCustomId(`cc_selectmenu_edit_${creator.id}_${count}`)
    .setPlaceholder(`Edit Command ${count}`)
    .addOptions(obj.splice(0,i))));
  }
  return chunks;
}