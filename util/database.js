const fs = require('fs');
const path = require('path');

var database = {
  assign: async function (key, value, obj) {
    var keys = Array.isArray(key) ? key : key.split("."), part;
    var last = keys.pop();
    while(part = keys.shift()) {
     if( typeof obj[part] != "object") obj[part] = {};
     obj = obj[part]; // update "pointer"
    }
    obj[last] = typeof value === "object" ? Array.isArray(value) ? value : Object.assign({}, obj[last], value) : value;
  },
  exist: function (key, obj) {
    const keys = Array.isArray(key) ? key : key.split(".");
    return keys.reduce((prev, curr) => { return prev ? prev[curr] : null }, obj || self);
  },
  get: async function (key) {
    const keys = Array.isArray(key) ? key.join(".") : key;
    const json = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "assets", "json", "database.json")));
    const result = await database.exist(keys, json)
    return result || {};
  },
  update : async function (key, data) {
    const keys = Array.isArray(key) ? key.join(".") : key;
    const json = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "assets", "json", "database.json")));
    const merged = Object.assign({}, json, database.assign(keys, data, json))
    await fs.writeFileSync(path.join(__dirname, "..", "assets", "json", "database.json"), JSON.stringify(merged, null, 2))
    return merged;
  },
  delete : async function (key) {
    const keys = Array.isArray(key) ? key : key.split("."); //path.split(".");
    const json = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "assets", "json", "database.json")));
    const result = await database.exist(keys, json);
    if (!result) return result;
    const target = keys.reduce((curr, acc, idx, arr) => {
        if (idx < arr.length - 1) curr = curr[acc];
        return curr;
    }, json);

    delete target[keys[keys.length - 1]];
    await fs.writeFileSync(path.join(__dirname, "..", "assets", "json", "database.json"), JSON.stringify(json, null, 2))
    return json;
  }
}

module.exports = database;
