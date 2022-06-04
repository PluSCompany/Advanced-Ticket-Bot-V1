module.exports = {
    name: "prefix",
    aliases: ["p"],
    run: (client, message, args, db) => {
        let newPrefix = args.join(" ");
        if (newPrefix) {
            db.set(`prefixes_${message.guild.id}`, newPrefix);
            db.save();
            message.channel.send("New prefix has been set!");
        }
        else {
            return message.channel.send(`Current prefix is: ${db.has(`prefixes_${message.guild.id}`)
                ? db.get(`prefixes_${message.guild.id}`)
                : require("../../config.json").prefix}`);
        }
    },
};
