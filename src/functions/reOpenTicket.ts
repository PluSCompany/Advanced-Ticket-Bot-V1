import { MessageEmbed } from "discord.js";
import { isStaff } from "./isStaff";
import { isTicketChannel } from "./isTicketChannel";
import { ticketOwner } from "./ticketOwner";

function reOpenTicket(guild, channel, message, db) {
  if (!isTicketChannel(guild, channel, db)) return;
  let owner = ticketOwner(guild, channel, db);
  if (!isStaff(guild, message.member, db) && owner !== message.author.id)
    return message.channel.send("You cannot use this command");
  if (!db.has(`tickets_${message.guild.id}_closed`))
    return message.reply("There are no tickets closed");
  let arr = db.get(`tickets_${message.guild.id}_closed`);
  if (!arr.includes(channel.id))
    return message.channel.send("This channel is not closed");
  channel
    .updateOverwrite(owner, {
      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })
    .then(() => {
      if (db.has(`tickets_${message.guild.id}_category`)) {
        let cate = db.get(`tickets_${message.guild.id}_category`);
        message.channel.setParent(cate);
      }
      message.channel.send(
        `<@${owner}>`,
        new MessageEmbed()
          .setColor("YELLOW")
          .setAuthor(
            message.author.username,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setDescription("The ticket has been reopened")
      );
      db.splice(`tickets_${message.guild.id}_closed`, channel.id);
      db.save();
    });
}

export { reOpenTicket };
