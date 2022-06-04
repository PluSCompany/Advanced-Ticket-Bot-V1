import { MessageAttachment, MessageEmbed } from "discord.js";
import { deleteTicket } from "../functions/deleteTicket";
import { isStaff } from "../functions/isStaff";
import { isTicketChannel } from "../functions/isTicketChannel";
import { reOpenTicket } from "../functions/reOpenTicket";
import { ticketOwner } from "../functions/ticketOwner";
const { fetchTranscript } = require("reconlx");

module.exports = {
  name: "close",
  description: "Close a opened ticket",
  run: (client, message, args, db) => {
    if (!isTicketChannel(message.guild, message.channel, db)) return;
    if (!isStaff(message.guild, message.member, db))
      return message.channel.send("You are not a staff member");
    const closeEmbed = new MessageEmbed()
      .setColor("BLUE")
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription("❌ - Delete\n📰 - Transcript\n📂 - Reopen");
    message.channel.send(closeEmbed).then((msg) => {
      let owner = ticketOwner(message.guild, message.channel, db);
      db.has(`tickets_${message.guild.id}_closed`)
        ? db.push(`tickets_${message.guild.id}_closed`, message.channel.id)
        : db.set(`tickets_${message.guild.id}_closed`, [message.channel.id]),
        [message.channel.id];
      message.channel.updateOverwrite(owner, {
        VIEW_CHANNEL: false,
      });
      if (db.has(`tickets_${message.guild.id}_closeCategory`)) {
        let categoryID = db.get(`tickets_${message.guild.id}_closeCategory`);
        try {
          message.channel.setParent(categoryID).catch(() => {});
        } catch {}
      }
      ["❌", "📰", "📂"].forEach((e) => {
        msg.react(e);
      });
      client.on("messageReactionAdd", async (reaction, user) => {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (user.id !== message.author.id) return;
        if (reaction.message.id !== msg.id) return;
        if (reaction.emoji.name === "❌") {
          deleteTicket(message, db);
        } else if (reaction.emoji.name === "📰") {
          let m = await message.reply(
            `Please wait well the transcript is generated..`
          );
          fetchTranscript(message, 99).then((data) => {
            const file = new MessageAttachment(data, "index.html");
            message.channel
              .send(file)
              .catch(() => {})
              .then(() => {
                m.delete().catch(() => {});
              })
              .catch(() => {});
          });
        } else if (reaction.emoji.name === "📂") {
          reOpenTicket(message.guild, message.channel, message, db);
        }
      });
    });
    db.save();
  },
};
