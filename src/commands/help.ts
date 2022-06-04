import { help } from "../models/helpInterface";
import { MessageEmbed } from "discord.js";
import { commands } from "../index";

module.exports = {
  name: "help",
  description: "Show all commands",
  run: (client, message, args, db) => {
    let arr = [];
    commands.map(<help>(command) => {
      arr.push(`${command.name} - ${command.description}`);
    });
    message.channel.send(
      new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(
          message.author.username,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(arr.join("\n"))
    );
  },
};
