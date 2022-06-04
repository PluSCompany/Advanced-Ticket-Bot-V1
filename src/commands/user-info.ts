import { MessageEmbed } from "discord.js";
import { isTicketChannel } from "../functions/isTicketChannel";
import { ticketOwner } from "../functions/ticketOwner";
import moment from "moment";

module.exports = {
  name: "user-info",
  description: "Get information about the owner of a ticket",
  run: async (client, message, args, db) => {
    if (!isTicketChannel(message.guild, message.channel, db)) return;
    let owner = ticketOwner(message.guild, message.channel, db);
    let user = await client.users.fetch(owner);
    let member = await message.guild.members.fetch(owner);

    const embed = new MessageEmbed()
      .setColor("RED")
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField("Tag", user.tag)
      .addField("ID", user.id)
      .addField("Joined server", moment(member.joinedAt).fromNow())
      .addField("Created account", moment(user.createdAt).fromNow())
      .addField(
        "Roles",
        member.roles.cache.map((role) => `<@&${role.id}>`)
      )
      .addField(
        "Server acknowledgements",
        member.id === message.guild.ownerID
          ? "Server owner"
          : member.hasPermission("ADMINISTRATOR")
          ? "Admin"
          : member.hasPermission("MANAGE_MESSAGES")
          ? "Moderator"
          : "Member"
      );

    message.channel.send(embed);
  },
};
