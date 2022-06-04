import { isStaff } from "../functions/isStaff";
import { isTicketChannel } from "../functions/isTicketChannel";
import { ticketOwner } from "../functions/ticketOwner";
import { fetchTranscript } from "reconlx";
import { MessageAttachment } from "discord.js";

module.exports = {
  name: "transcript",
  description: "Create a transcript of a ticket",
  run: async (client, message, args, db) => {
    if (!isTicketChannel(message.guild, message.channel, db))
      return message.channel.send("This is not a ticket channel");
    let owner = ticketOwner(message.guild, message.channel, db);
    if (
      !isStaff(message.guild, message.member, db) &&
      owner !== message.author.id
    )
      return message.reply("You are not a staff member");
    let msg = await message.channel.send("Generating transcript..");
    fetchTranscript(message, 99).then((data) => {
      message.channel
        .send(new MessageAttachment(data, "index.html"))
        .then(() => {
          msg.delete();
        });
    });
  },
};
