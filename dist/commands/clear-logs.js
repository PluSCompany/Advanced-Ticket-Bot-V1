module.exports = {
    name: "clear-logs",
    run: (client, message, args, db) => {
        if (!db.has(`tickets_${message.guild.id}_settings.save-logs`))
            return message.channel.send("The save-logs feature is not enabled");
        if (db.get(`tickets_${message.guild.id}_settings.save-logs`).func !== true)
            return message.channel.send("The save-logs feature is not enabled");
        if (!db.has(`save_logs_${message.guild.id}`))
            return message.channel.send("There are no logs for this server");
        db.delete(`save_logs_${message.guild.id}`);
        db.save();
        message.channel.send("All the ticket logs has been cleared");
    },
};
