require("dotenv").config()
const path = require("path");
const fs = require("fs");
const io = require("socket.io");
const cloudinary = require("cloudinary").v2;
cloudinary.config()
const { get } = require("./get");
class Back {
    constructor(client, guild, server) {
      this.io = io(server, {
        maxHttpBufferSize: 50e9
      });
      this.client = client;
      this.guild = guild;
      this.status = function (report, data) {
        return { status: report, data: data }
      }
      this.io.on('connection', async (socket) => {
        socket.on("getData", async (query, type) => {
          if (type == "channel") {
            const guild = this.client.guilds.cache.get(this.guild)
            const channel = guild.channels.cache.filter(channel => channel).map(channel=> { return {type: channel.type, name: channel.name, id:channel.id} })
            socket.emit("getData", this.status("success", {channel, type}))
          } else if (type == "member") {
            const guild = this.client.guilds.cache.get(this.guild)
            const member = guild.members.cache.filter(member => member).map(member=> { return {bot: member.user.bot, username: member.user.username, id:member.user.id, discriminator: member.user.discriminator} })
            socket.emit("getData", this.status("success", {member, type}))
          } else if (type == "role") {
            const guild = this.client.guilds.cache.get(this.guild)
            const role = guild.roles.cache.filter(role => role).map(role => { return {name: role.name, id:role.id, color: role.color, position: role.position, permissions: role.permissions.serialize()} })
            socket.emit("getData", this.status("success", {role,type}))
          } else {
            this.client.db.child(this.guild).child(query).once("value", async(s) => socket.emit("getData", this.status("success", { data: s.val(), type: type})))
          }
        })
        socket.on("postData", async (query, data, type) => {
          if (type === "log") {

          } else {
            await this.client.db.child(this.guild).child(query).update(data)
            socket.emit("postData", this.status("success"))
          }
        })
        socket.on("removeData", async (query, data) => {
          await this.client.db.child(query).remove()
          socket.emit("removeData", this.status("success"))
        })
        socket.on("uploadImage", async (src, file, type) => {
          if (typeof src == "undefined") return socket.emit("uploadImage", this.status());
          if (typeof file == "undefined") return socket.emit("uploadImage", this.status());
          var data;
          if (src.startsWith("http")) {
            let result = await get.Buffer(src)
            data = result.data
          } else {
            data = Buffer.from(src, "base64");
          }
          const options = {
            versions: false,
            folder : this.guild+"/"+file.path,
            public_id: file.name,
            format: file.type
          }
          cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return socket.emit("uploadImage", this.status());
            const image = result.secure_url;
            socket.emit("uploadImage", this.status("success", {url: image, file: file, type: type }))
          }).end(data)
        })
        socket.on("sendMessage", async (channelId, message) => {
          const guild = this.client.guilds.cache.get(this.guild)
          const channel = guild.channels.cache.get(channelId)
          if (!channel) return socket.emit("sendMessage", this.status());
          channel.send(message).then(()=> socket.emit("sendMessage", this.status("success")))
        })
        socket.on('disconnect', async () => {
          //socket.emit("disconnect")
        })
      })
    }
}
module.exports = Back
