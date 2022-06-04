module.exports = {
    name: "add-staffrole",
    description: "Add a staff role to the tickets",
    run: (client, message, args, db) => {
        const role = message.mentions.roles.first();
        if (!role)
            return message.channel.send("No role was mentioned");
        if (db.has(`tickets_${message.guild.id}_staffRoles`)) {
            db.push(`tickets_${message.guild.id}_staffRoles`, role.id);
        }
        else {
            db.set(`tickets_${message.guild.id}_staffRoles`, [role.id]);
        }
        db.save();
        message.reply("Added staff role!");
    },
};
