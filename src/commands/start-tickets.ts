import { MessageEmbed } from "discord.js";

module.exports = {
  name: "start-tickets",
  description: "Start the ticket system",
  run: async (client, message, args, db) => {
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription("React to open a ticket")
      .setFooter(
        "Fast and easy tickets",
        message.guild.iconURL({ dynamic: true })
      );
    let msg = await message.channel.send(embed);
    msg.react("📩");
    let d = db.get(`tickets_${message.guild.id}`);
    let objToSave = {
      msgID: msg.id,
    };
    if (d) {
      if (d["num"]) objToSave["num"] = d["num"];
    }
    db.set(`tickets_${message.guild.id}`, objToSave);
    db.save();
  },
};
