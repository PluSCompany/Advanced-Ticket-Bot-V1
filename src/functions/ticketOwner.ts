function ticketOwner(guild, channel, db) {
  let result = null;
  if (db.has(`tickets_${guild.id}_userChannel`)) {
    let cc = db.get(`tickets_${guild.id}_userChannel`);
    cc.forEach((object) => {
      if (object.channel === channel.id) result = object.user;
    });
  }
  return result;
}

export { ticketOwner };
