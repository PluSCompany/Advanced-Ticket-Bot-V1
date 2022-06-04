"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTicket = void 0;
function deleteTicket(message, db) {
    if (db.has(`tickets_${message.guild.id}_ticketChannels`)) {
        if (!db
            .get(`tickets_${message.guild.id}_ticketChannels`)
            .includes(message.channel.id))
            return;
    }
    let isStaff = false;
    let hasStaff = false;
    let staffRoles = [];
    if (db.has(`tickets_${message.guild.id}_staffRoles`)) {
        hasStaff = true;
        db.get(`tickets_${message.guild.id}_staffRoles`).forEach((role) => {
            staffRoles.push(role);
        });
    }
    if (hasStaff === false)
        return message.channel.send("No staff roles were found.. No one can use this command");
    staffRoles.some((r) => {
        if (message.member.roles.cache.has(r))
            isStaff = true;
    });
    if (!isStaff)
        return message.channel.send("You are not a staff member");
    message.channel.delete().then(() => {
        db.splice(`tickets_${message.guild.id}_ticketChannels`, message.channel.id);
        let cc = db.get(`tickets_${message.guild.id}_userChannel`);
        let iniY;
        let iniX;
        cc.forEach((y) => {
            if (y.channel === message.channel.id) {
                iniY = true;
                iniX = y.user;
            }
        });
        if (iniX) {
            db.splice(`tickets_${message.guild.id}_userChannel`, {
                user: iniX,
                channel: message.channel.id,
            });
        }
        db.splice(`tickets_${message.guild.id}_curUsers`, iniX);
        db.save();
    });
}
exports.deleteTicket = deleteTicket;
