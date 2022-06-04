"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reOpenTicket_1 = require("../functions/reOpenTicket");
module.exports = {
    name: "reopen",
    description: "Re-open a closed ticket",
    aliases: ["re-open"],
    run: (client, message, args, db) => {
        reOpenTicket_1.reOpenTicket(message.guild, message.channel, message, db);
    },
};
