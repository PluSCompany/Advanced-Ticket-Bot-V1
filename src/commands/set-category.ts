module.exports = {
  name: "set-category",
  aliases: ["set-cat"],
  description: "Set the category for all tickets to be placed",
  run: (client, message, args, db) => {
    let ID = args[0];
    if (!ID) return message.channel.send("No category ID was given");
    if (!message.guild.channels.cache.has(ID))
      return message.channel.send("Could not find that category");
    let categories = message.guild.channels.cache.filter(
      (x) => x.type === "category"
    );
    let categoryExists = false;
    categories.forEach((w) => {
      if (w.id === ID) {
        categoryExists = true;
      }
    });

    if (categoryExists === false)
      return message.channel.send("No category was found");
    db.set(
      `tickets_${message.guild.id}_category`,
      ID
      // message.guild.channels.cache.get(ID)
    );
    db.save();
    message.reply("Ticket category has been set");
  },
};
