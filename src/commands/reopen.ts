import { reOpenTicket } from "../functions/reOpenTicket";

module.exports = {
  name: "reopen",
  description: "Re-open a closed ticket",
  aliases: ["re-open"],
  run: (client, message, args, db) => {
    reOpenTicket(message.guild, message.channel, message, db);
  },
};
