"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../models/settings");
module.exports = {
    name: "enable",
    description: "Enable a setting",
    run(client, message, args, db) {
        let setting = args[0];
        if (!setting)
            return message.channel.send("No setting was given");
        if (!settings_1.settings.includes(setting))
            return message.channel.send("Invalid setting given");
        db.set(`tickets_${message.guild.id}_settings.${setting}`, {
            func: true,
            enabledBy: message.author.id,
        });
        db.save();
        message.channel.send(`${setting} enabled`);
    },
};
