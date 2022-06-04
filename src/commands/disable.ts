import { settings } from "../models/settings";

module.exports = {
  name: "disable",
  description: "Disable a setting",
  run(client, message, args, db) {
    let setting = args[0];
    if (!setting) return message.channel.send("No setting was given");
    if (!settings.includes(setting))
      return message.channel.send("Invalid setting given");
    db.set(`tickets_${message.guild.id}_settings.${setting}`, {
      func: false,
      enabledBy: message.author.id,
    });
    db.save();
    message.channel.send(`${setting} enabled`);
  },
};
