"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStaff = void 0;
function isStaff(guild, member, db) {
    let output = null;
    if (db.has(`tickets_${guild.id}_staffRoles`)) {
        let staffRoles = db.get(`tickets_${guild.id}_staffRoles`);
        member.roles.cache.some((role) => {
            if (staffRoles.includes(role.id)) {
                output = true;
            }
        });
    }
    return output;
}
exports.isStaff = isStaff;
