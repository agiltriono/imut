module.exports = {
  name : "guildCreate",
  async execute(guild, client) {
    // Initial database
    client.db.update(guild.id, {
      [guild.id] : {
        "prefix": "sg",
        "bc": "",
        "booster": {
          "booster_role": "",
          "channel": "",
          "content": {
            "content": "hei {member} thank you for boosting this server !",
            "embeds": []
          },
          "enable": false,
          "ex_booster_role": "",
          "show": "content"
        },
        "cc": [],
        "gb": {
          "channel": "",
          "enable": false,
          "m": {
            "content": "Selamat Tinggal {member}",
            "embeds": []
          },
          "show": "content"
        },
        "manager": [
          {
            "id": "858510813811441675",
            "password": "admin",
            "username": "agiel"
          }
        ],
        "voice": {
          "allow_link": "youtu.be,spotify.com,soundcloud.com",
          "creator": "",
          "temp": {}
        },
        "wc": {
          "channel": "",
          "enable": false,
          "m": {
            "content": "Selamat datang {member}, enjoy our server!",
            "embeds": []
          },
          "show": "content"
        },
        "modlink": []
      }
    })
  }
}
