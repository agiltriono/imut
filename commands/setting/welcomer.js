const { database, clear, getmsg, embeds, remove, color } = require(".././../util/util");
const { MessageButton } = require("discord.js");
const db = database.ref("guild");
module.exports.help = {
  name: "welcomer",
  aliases: ["wc"],
  cooldown: 3,
  category: "Setting",
  usage: "",
  permissions: ["ADMINISTRATOR"],
  description: "Set Welcome & Goodbye Mesage."
}

module.exports.run = async function(msg, args, creator, prefix) {
  await msg.delete()
  if (!msg.guild.me.permissions.has("SEND_MESSAGES")) return msg.channel.send(embeds("❌ Aku butuh permissions `SEND_MESSAGES`")).then(m=> clear(m, 3000));
  var row = {
    type: 1,
    components: [
      new MessageButton().setCustomId('welcomer').setLabel("Welcome").setEmoji("🤗").setStyle('PRIMARY'),
      new MessageButton().setCustomId('goodbye').setLabel("Goodbye").setEmoji("👋").setStyle('PRIMARY'),
      new MessageButton().setCustomId('cancel').setEmoji("❌").setLabel("Tutup").setStyle('DANGER')]
  }
  const message = await msg.channel.send({ embeds : [{
      color: color(),
      title: "WELCOMER",
      description: "**Apa yang mau di edit kak❔**"
  }],
    components: [row]
  })
  const filter = m => {
    if (m.user.id != creator.id) return m.reply({content: "Jangan ganggu dong!",ephemeral:true})
    return m.customId && m.user.id === creator.id;
  }
  const c = message.createMessageComponentCollector({
    filter,
    componentType : 'BUTTON',
    time : 100000
  })
  
  c.on('collect', async (m) => {
    var id = m.customId;
    c.stop(id)
  })
  c.on('end', async (collected, reason) => {
    await message.delete()
    if (reason === 'welcomer') {
      return welcomer(msg, creator)
    } else if (reason === 'goodbye') {
      return goodbye(msg, creator)
    } else if (reason === "cancel") {
      return;
    }
  })
}
async function welcomer (msg, creator) {
  db.child(msg.guild.id).once("value", async (server) => {
    let wc = server.child("wc")
    let enable = wc.child("enable").val()
    let status = enable == "yes" ? "yes" : "no" 
    var row_enable = {
      type: 1,
      components: [
        new MessageButton().setCustomId('welcomer_button_disable_'+creator.id).setEmoji("🚫").setLabel("Disable").setStyle('DANGER'),
        new MessageButton().setCustomId('welcomer_button_edit_'+creator.id).setEmoji("📝").setLabel("Edit").setStyle('PRIMARY').setDisabled(false),
        new MessageButton().setCustomId('welcomer_button_close_'+creator.id).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
      ]
    }
    var row_disable = {
      type: 1,
      components: [
        new MessageButton().setCustomId('welcomer_button_enable_'+creator.id).setEmoji("✅").setLabel("Enable").setStyle('SUCCESS'),
        new MessageButton().setCustomId('welcomer_button_edit_'+creator.id).setEmoji("📝").setLabel("Edit").setStyle('PRIMARY').setDisabled(true),
        new MessageButton().setCustomId('welcomer_button_close_'+creator.id).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
      ]
    }
    var row = status === "yes" ? row_enable : row_disable
    const content = {
      embeds : [{
        color: color(),
        title: "WELCOMER",
        description: `Status : ${status == "yes" ? "Aktif" : "Nonaktif"}`
      }],
      components: [row]
    }
    await msg.channel.send(content)
  })
}
async function goodbye(msg, creator) {
  db.child(msg.guild.id).once("value", async (server) => {
    let gb = server.child("gb")
    let enable = gb.child("enable").val()
    let status = enable == "yes" ? "yes" : "no" 
    var row_enable = {
      type: 1,
      components: [
        new MessageButton().setCustomId('goodbye_button_disable_'+creator.id).setEmoji("🚫").setLabel("Disable").setStyle('DANGER'),
        new MessageButton().setCustomId('goodbye_button_edit_'+creator.id).setEmoji("📝").setLabel("Edit").setStyle('PRIMARY').setDisabled(false),
        new MessageButton().setCustomId('goodbye_button_close_'+creator.id).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
      ]
    }
    var row_disable = {
      type: 1,
      components: [
        new MessageButton().setCustomId('goodbye_button_enable_'+creator.id).setEmoji("✅").setLabel("Enable").setStyle('SUCCESS'),
        new MessageButton().setCustomId('goodbye_button_edit_'+creator.id).setEmoji("📝").setLabel("Edit").setStyle('PRIMARY').setDisabled(true),
        new MessageButton().setCustomId('goodbye_button_close_'+creator.id).setLabel("Tutup").setEmoji("❌").setStyle('DANGER')
      ]
    }
    var row = status === "yes" ? row_enable : row_disable
    const content = {
      embeds : [{
        color: color(),
        title: "GOODBYE",
        description: `Status : ${status == "yes" ? "Aktif" : "Nonaktif"}`
      }],
      components: [row]
    }
    await msg.channel.send(content)
  })
}