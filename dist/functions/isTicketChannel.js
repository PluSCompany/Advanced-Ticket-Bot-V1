"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTicketChannel = void 0;
function isTicketChannel(guild, channel, db) {
    let result = null;
    if (db.has(`tickets_${guild.id}_ticketChannels`)) {
        if (db.get(`tickets_${guild.id}_ticketChannels`).includes(channel.id))
            result = true;
    }
    return result;
}
exports.isTicketChannel = isTicketChannel;
