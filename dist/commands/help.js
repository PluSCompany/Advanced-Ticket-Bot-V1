"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
module.exports = {
    name: "help",
    description: "Show all commands",
    run: (client, message, args, db) => {
        let arr = [];
        index_1.commands.map((command) => {
            arr.push(`${command.name} - ${command.description}`);
        });
        message.channel.send(new discord_js_1.MessageEmbed()
            .setColor("BLUE")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(arr.join("\n")));
    },
};
