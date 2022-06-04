"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: "staffroles",
    aliases: ["staff-roles"],
    description: "Show all saved staff roles",
    run: (client, message, args, db) => {
        let staffroles = db.get(`tickets_${message.guild.id}_staffRoles`);
        if (!staffroles)
            return message.channel.send("There are no staff roles set");
        const embed = new discord_js_1.MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(staffroles.map((x) => `<@&${x}>`));
        message.channel.send(embed);
    },
};
