module.exports = {
    name: "close-category",
    description: "Ticket will be moved to this category when its closed",
    aliases: ["close-cat"],
    run: (client, message, args, db) => {
        let ID = args[0];
        if (!ID)
            return message.channel.send("No category ID was given");
        if (!message.guild.channels.cache.has(ID))
            return message.channel.send("Could not find that category");
        let categories = message.guild.channels.cache.filter((x) => x.type === "category");
        let categoryExists = false;
        categories.forEach((w) => {
            if (w.id === ID) {
                categoryExists = true;
            }
        });
        if (categoryExists === false)
            return message.channel.send("No category was found");
        db.set(`tickets_${message.guild.id}_closeCategory`, ID
        // message.guild.channels.cache.get(ID)
        );
        db.save();
        message.reply("Ticket close category has been set");
    },
};
