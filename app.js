require("dotenv")
const express = require("express");
const path = require("path");
const fs = require("fs")
const cheerio = require("cheerio");
const Buffer = require("Buffer")
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const http = require("http")
const server = http.createServer(app)
const Back = require("./util/back");
const port = 3000;
const source = path.join(__dirname, '.', 'server');
app.use(session({
  secret: 'express.sid',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({ checkPeriod: 86400000 }),
	cookie: { maxAge: 86400000 }
}));
app.use(bodyParser.json({
  limit: "500mb"
}));
app.use(bodyParser.urlencoded({
  limit: '500mb',
  parameterLimit: 1000000,
	extended: true
}));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use('/', express.static(source));
function status (report, data) {
  return {status: report, data: data}
}
class Method {
  constructor(client, guild, server) {
    this.back = new Back(client, guild, server);
    this.client = client;
    this.db = client.db
    this.guild = guild;
  }
  voiceList() {
    const guildId = this.guild;
    const guild = this.client.guilds.cache.get(guildId)
    return new Promise((resolve, reject) => {
      this.db.child(guildId).once("value", async (s)=> {
        var tmp = s.child(guildId).child("vc").child("temp")
        if (!tmp.exists()) {
          resolve(JSON.stringify([]))
        } else {
          let obj = tmp.val()
          let temp = []
          for (let key in obj) {
            const owner = guild.members.cache.get(obj[key].owner)
            const channel = guild.channels.cache.get(key)
            temp.push({
              channel: {
                name: channel.name,
                id: channel.id,
                member: channel.members.cache.filter(u=>u).map(m=>{return {id:m.user.id, username:m.user.username, discriminator: m.user.discriminator, avatar:m.user.displayAvatarURL({dynamic:true})}})
              }, 
              owner:{
                id: owner.user.id,
                username: owner.user.username,
                discriminator: owner.user.discriminator,
                avatar: owner.user.displayAvatarURL({dynamic:true})
              }
            })
          }
          resolve(JSON.stringify(temp))
        }
      })
    })
  }
}
class Server extends Method {
  constructor(client, guild = process.env.GUILD) {
    super(client, guild, server);
    this.client = client;
    this.guild = guild;
    this.init(app)
  }
  init (app) {
    const pageFolder = fs.readdirSync('./server/view/pages').filter(file => file.endsWith('.ejs'));
    for (const file of pageFolder) {
    	app.get(`/${path.parse(file).name}`, (req, res) => {
    	  if (!req.session.username) return res.redirect("/");
    	  this.client.db.child(this.guild).once("value", async (s) => {
      	  const data = this.getUser(s.child("manager").exists() ? [...s.child("manager").val()] : [], req.session.username)
      	  const guild = this.client.guilds.cache.get(this.guild)
      	  const member = guild.members.cache.get(data.id)
      	  const voice = await this.voiceList(this.guild)
      	  const pages = pageFolder.map((file) => {
      	    let name = path.parse(file).name.replace(".ejs","")
      	    let title = name.includes("-") ? name.split("-").map(str=> str.charAt(0).toUpperCase()+str.slice(1).toLowerCase()).join(' ') : name.charAt(0).toUpperCase()+name.slice(1).toLowerCase()
      	    return {name:name, title:title}
      	  })
          pages.sort((a,b) => b.name - a.name)
      	  const user = {
      	    user: {
      	      id: member.user.id,
      	      username: member.user.username,
      	      discriminator: member.user.discriminator,
      	      avatar: member.user.displayAvatarURL({dynamic:true}),
      	      role: {
      	        current: {
      	          id: member.roles.highest.id,
      	          name: member.roles.highest.name
      	        },
      	        all: member.roles.cache
      	      },
      	      channel: guild.channels.cache,
      	      member: guild.members.cache
      	    },
      	    voice: voice,
      	    pages : pages.map(page=> `<li class="nav-item"><a class="nav-link" href="/${page.name}"><i class="icon-box menu-icon"></i><span class="menu-title">${page.title}</span></a></li>`).join('')
      	  }
      	  this.render(req, res, `dashboard.ejs`, path.parse(file).name, user);
    	  })
      })
    }
    app.get('/login', (req, res) => {
      if (req.session.username) return res.status(301).redirect("/admin");
    	this.render(req, res, 'home.ejs', "Login", {message: "<div class='alert alert-warning'>Harap masuk untuk melanjutkan.</div>"});
    })
    app.get('/logout', (req, res) => {
      if (!req.session.username) return res.status(301).redirect("/");
      req.session.destroy()
    	res.status(301).redirect("/");
    })
    app.get('/', (req, res) => {
      if (req.session.username) return res.status(301).redirect("/admin");
    	this.render(req, res, 'home.ejs', "Login", {message: "<div class='alert alert-warning'>Harap masuk untuk melanjutkan.</div>"});
    })
    app.post('/:type', (req, res) => {
      const param = req.params.type
      if(!param) res.send(400);
      const data = req.body
      if (param === "login") {
         this.client.db.child(this.guild).once("value", async (s)=>{
           const user = this.getUser(s.child("manager").exists() ? [...s.child("manager").val()] : [], data.username)
           if (!user) return this.render(req, res, "home.ejs", "Login", {message: "<div class='alert alert-danger'><i class='fas fa-exclamation-triangle'></i> Username yang anda masukan salah!</div>"});
           if (user.password != data.password) return this.render(req, res, "home.ejs", "Login", {message: "<div class='alert alert-danger'><i class='fas fa-exclamation-triangle'></i> Password yang anda masukan salah!</div>"});
           req.session.username = user.username;
           req.session.role = user.hasOwnProperty("role") ? user.role : 0;
           res.status(301).redirect("/admin")
         })
      }
    })
    server.listen(process.env.PORT, () => console.log(`Server running..`));
  }
  getUser(data, username) {
    const array = data.filter(data=>data.username === username)
    if (array.length === 0) return false;
    return array[0]
  }
  render(req, res, pagePath, pageName, data = {}) {
  	const baseData = {
  	  guild: this.client.guilds.cache.get(this.guild),
  	  user: data.hasOwnProperty("user") ? data.user : null,
  	  botId: this.client.user.id,
  	  botUsername: this.client.user.username,
  	  botAvatar: this.client.user.displayAvatarURL({dynamic: true}),
  		pageTitle : pageName.replace(/\-/g, " ").toUpperCase(),
  		pageName: pageName
  	};
  	res.render(path.resolve(`${source}/view/${pagePath}`), { data: Object.assign({}, baseData, data) });
  }
}
module.exports = Server