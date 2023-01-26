const gfetch = require(".././../util/gif");
const { embeds, clear, color } = require(".././../util/util");

module.exports.help = {
  name: "kiss",
  aliases: ["mwa"],
  category: "Fun",
  usage: "<@mention>",
  permissions: ["EMBED_LINKS","ATTACH_FILES"],
  description: "Cium member"
}

module.exports.run = async function(msg, args, creator, prefix) {
  await msg.delete()
  if (!msg.guild.me.permissions.has("EMBED_LINKS") || !msg.guild.me.permissions.has("ATTACH_FILES")) return msg.channel.send(embeds("❌ Aku butuh permissions `EMBED_LINKS`, `ATTACH_FILES`")).then(m=> clear(m, 3000));
  
  var regex = /^<@!?[0-9]*>$/gm;
  
  if (!args.length || !regex.test(args[0])) return;
  var IDstring = args[0].replace(/[\\<>@#&!]/g, "");
  var member = msg.guild.members.cache.get(IDstring);
  var url = await gfetch({
    source:'TENOR',
    term:'kiss',
    limit: 40
  });
  let embeds = {
    color: color(),
    description: `<@${creator.id}> ciuman mesra <@${member.user.id}>!`,
    image: {
      url: url
    }
  }
  await msg.channel.send({ embeds : [embeds] })
}