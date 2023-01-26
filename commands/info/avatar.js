const { embeds, clear, color } = require(".././../util/util");

module.exports.help = {
  name: "avatar",
  aliases: ["ava", "profile", "picture", "pic"],
  category: "Info",
  usage: "@mention",
  permissions: ["SEND_MESSAGES","ATTACH_FILES"],
  description: "Tampilkan avatar member"
}

module.exports.run = async function(msg, args, creator, prefix) {
  await msg.delete()
  if (!msg.guild.me.permissions.has("SEND_MESSAGES") && !msg.guild.me.permissions.has("ATTACH_FILES")) return msg.channel.send(embeds("❌ Aku butuh permissions `EMBED_LINKS`, `ATTACH_FILES`")).then(m=> clear(m, 3000));
  var member = msg.guild.members.cache.get(creator.id)
  if (!args.length) {
     let embeds = {
       color: color(),
        image: {
          url: member.user.displayAvatarURL({ 
            dynamic : true,
            size : 512
          })
        }
      }
      await msg.channel.send({ embeds : [embeds] })
  } else {
      var IDstring = args[0].replace(/[\\<>@#&!]/g, "");
      var target = msg.guild.members.cache.get(IDstring);
      let embeds = {
        color: color(),
        image: {
          url: target.user.displayAvatarURL({ dynamic : true,
            size : 512
          })
        }
      }
      await msg.channel.send({ embeds : [embeds] })
  }
}