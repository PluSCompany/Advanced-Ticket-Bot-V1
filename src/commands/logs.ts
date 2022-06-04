import { MessageEmbed } from "discord.js";
import moment from "moment";

module.exports = {
  name: "logs",
  description: "Get all saved ticket logs",
  run: (client, message, args, db) => {
    if (!db.has(`tickets_${message.guild.id}_settings.save-logs`))
      return message.channel.send("Logs are not enabled");
    let settingsData = db.get(`tickets_${message.guild.id}_settings.save-logs`);
    if (settingsData.func !== true)
      return message.channel.send("Logs are not enabled");
    if (!args[0]) {
      let logData = db.get(`save_logs_${message.guild.id}`);
      let embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(
          message.author.username,
          message.author.displayAvatarURL({ dynamic: true })
        );

      let str = "";

      Object.keys(logData).map(async (key) => {
        let obj = logData[key];
        let owner = await client.users.fetch(obj["ticketOwnerID"]);
        str += `\n\n${key} | ${owner.tag}\n${moment(
          obj["ticketMade"]
        ).fromNow()} - Ticket number: ${obj["ticketNum"]}`;
      });

      message.channel.send("Fetching data...").then(() => {
        setTimeout(() => {
          embed.setDescription(str);

          message.channel.send(embed);
        }, 2000);
      });
    } else {
      let ID = args[0];
      let logData = db.get(`save_logs_${message.guild.id}.${ID}`);
      if (!logData) return message.channel.send("Invalid log ID given");
      let embed = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(
          message.author.username,
          message.author.displayAvatarURL({ dynamic: true })
        );

      let str = "";

      let tOwner;

      let obj = {};

      Object.keys(logData).map(async (piece) => {
        obj[piece] = logData[piece];
      });
      setTimeout(async () => {
        tOwner = obj["ticketOwnerID"];
        let owner = await client.users.fetch(obj["ticketOwnerID"]);
        str += `${ID} | ${owner.tag}\n${moment(
          obj["ticketMade"]
        ).fromNow()} - Ticket number: ${obj["ticketNum"]}`;
      }, 1000);

      message.channel.send("Fetching data...").then(() => {
        setTimeout(async () => {
          let owner = await client.users.fetch(tOwner);
          if (str.length > 2000) {
            str = str.replace(str.slice(2000), "...");
          }
          embed
            .setTitle("ID: " + ID)
            .addField(
              "User info:",
              `ID: ${owner.id}\nUsername: ${
                owner.username
              }\nCreated account: ${moment(owner.createdAt).fromNow()}`
            )
            .addField(
              "Ticket info",
              `Channel ID: ${
                obj["channelID"]
              }\nTicket active: ${message.guild.channels.cache.has(
                obj["channelID"]
              )}\nTicket number: ${obj["ticketNum"]}\nCreated at: ${moment(
                obj["ticketMade"]
              ).fromNow()}`
            );

          message.channel.send(embed);
        }, 2000);
      });
    }
  },
};
