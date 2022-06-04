"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
function deleteUser(guild, userID, db) {
    if (db.has(`tickets_${guild.id}_curUsers`)) {
        db.splice(`tickets_${guild.id}_curUsers`, userID);
        db.save();
    }
}
exports.deleteUser = deleteUser;
