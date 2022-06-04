module.exports = {
    name: "blacklist-user",
    description: "Manage blacklists of the ticket system",
    run: (client, message, args, db) => {
        if (!args[0])
            return message.channel.send("No type was given");
        if (args[0] === "add") {
            let user = message.mentions.users.first();
            if (!user)
                return message.channel.send("No user was mentioned");
            if (db.has(`tickets_${message.guild.id}_blacklists`)) {
                db.push(`tickets_${message.guild.id}_blacklists`, user.id);
            }
            else {
                db.set(`tickets_${message.guild.id}_blacklists`, [user.id]);
            }
            db.save();
            message.channel.send("The user has been blacklisted from using tickets");
        }
        if (args[0] === "remove") {
            let user = message.mentions.users.first();
            if (!user)
                return message.channel.send("No user was mentioned");
            if (!db.has(`tickets_${message.guild.id}_blacklists`))
                return message.channel.send("There are no blacklists of this server");
            if (!db.get(`tickets_${message.guild.id}_blacklists`).includes(user.id))
                return message.reply("The user is not blacklisted");
            db.splice(`tickets_${message.guild.id}_blacklists`, user.id);
            db.save();
            message.channel.send("The user has been unblacklisted");
        }
    },
};
