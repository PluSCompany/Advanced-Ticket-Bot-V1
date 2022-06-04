"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isStaff_1 = require("../functions/isStaff");
const isTicketChannel_1 = require("../functions/isTicketChannel");
const ticketOwner_1 = require("../functions/ticketOwner");
module.exports = {
    name: "claim",
    description: "Claim a ticket",
    run: (client, message, args, db) => {
        let claimDisabled = "The claim system is disabled";
        if (!db.has(`tickets_${message.guild.id}_settings`))
            return message.channel.send(claimDisabled);
        if (!db.has(`tickets_${message.guild.id}_settings.claim`))
            return message.channel.send(claimDisabled);
        let data = db.get(`tickets_${message.guild.id}_settings.claim`);
        if (data.func === true) {
            if (!isTicketChannel_1.isTicketChannel(message.guild, message.channel, db))
                return;
            if (!isStaff_1.isStaff(message.guild, message.member, db))
                return message.channel.send("You are not a staff member");
            let owner = ticketOwner_1.ticketOwner(message.guild, message.channel, db);
            let staffRoles = db.has(`tickets_${message.guild.id}_staffRoles`)
                ? db.get(`tickets_${message.guild.id}_staffRoles`)
                : null;
            if (staffRoles) {
                staffRoles.forEach((r) => {
                    message.channel.updateOverwrite(r, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: true,
                    });
                });
                message.channel.send(`The ticket has been claimed by ${message.author}`);
            }
            else
                return;
        }
        else
            return message.channel.send(claimDisabled);
    },
};
