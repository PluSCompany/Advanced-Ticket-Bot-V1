import { Client, Collection } from "discord.js";
const client = new Client({
  partials: ["CHANNEL", "MESSAGE", "REACTION"],
});
import fs from "fs";
const { slayersDB } = require("slayer.db");
const db = new slayersDB({
  saveReadable: true,
  saveInternal: {
    func: true,
    dir: "database",
  },
});

const commands = new Collection();
const aliases = new Collection();

let files = fs.readdirSync("./dist/commands/");

files.forEach((file) => {
  let pull = require(`./commands/${file}`);
  commands.set(pull.name, pull);
  if (pull.aliases) {
    pull.aliases.forEach((alias) => {
      aliases.set(alias, pull.name);
    });
  }
});

fs.readdir("./dist/events/", (err, files) => {
  files.forEach((file) => {
    let eventName = file.split(".")[0];
    client.on(
      eventName,
      require(`./events/${eventName}`).bind(null, client, db)
    );
  });
});

import { cmds } from "./models/commandsInterface";

client.on("ready", () => {
  console.clear();
  console.log("Ready");
});

client.on("message", (message) => {
  let prefix = require(`../config.json`).prefix;

  if (!message.guild) return;

  if (db.has(`prefixes_${message.guild.id}`)) {
    prefix = db.get(`prefixes_${message.guild.id}`);
  }
  if (
    message.author.bot ||
    !message.content.startsWith(prefix) ||
    message.channel.type === "dm"
  )
    return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (commands.has(command) || commands.has(aliases.get(command))) {
    let cmd =
      <cmds>commands.get(command) || <cmds>commands.get(aliases.get(command));

    cmd.run(client, message, args, db);
  }
});

client.login(require("../config.json").token);

export { commands, aliases, client };
