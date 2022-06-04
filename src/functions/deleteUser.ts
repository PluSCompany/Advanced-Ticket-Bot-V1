function deleteUser(guild, userID, db) {
  if (db.has(`tickets_${guild.id}_curUsers`)) {
    db.splice(`tickets_${guild.id}_curUsers`, userID);
    db.save();
  }
}

export { deleteUser };
