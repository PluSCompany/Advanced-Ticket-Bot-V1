import { MessageAttachment, MessageEmbed } from "discord.js";
import { deleteUser } from "../functions/deleteUser";
const { fetchTranscript } = require("reconlx");

module.exports = (client, db, member) => {
  let { guild } = member;
  let cc = db.get(`tickets_${guild.id}_userChannel`);
  if (db.has(`tickets_${guild.id}_curUsers`)) {
    db.splice(`tickets_${guild.id}_curUsers`, member.id);
  }
  if (cc) {
    cc.forEach((obj) => {
      if (obj.user === member.id) {
        let ch = guild.channels.cache.get(obj.channel);
        guild.channels.cache
          .get(obj.channel)
          .send(
            new MessageEmbed()
              .setColor("RED")
              .setAuthor(
                member.user.username,
                member.user.displayAvatarURL({ dynamic: true })
              )
              .setDescription("The ticket owner has left the server")
          )
          .then((msg) => {
            deleteUser(guild, member.id, db);
            ["❌", "📰"].forEach((e) => {
              msg.react(e);
            });
            client.on("messageReactionAdd", async (reaction, user) => {
              if (reaction.message.partial) await reaction.message.fetch();
              if (reaction.partial) await reaction.fetch();
              if (user.bot) return;
              let { message } = reaction;
              if (reaction.emoji.name === "❌") {
                ch.delete();
              } else if (reaction.emoji.name === "📰") {
                let m = await message.reply(
                  `Please wait well he transcript is generated..`
                );
                fetchTranscript(message, 99).then((data) => {
                  const file = new MessageAttachment(data, "index.html");
                  message.channel.send(file).then(() => {
                    m.delete();
                  });
                });
              }
            });
          });
      }
    });
  }
  db.save();
};
