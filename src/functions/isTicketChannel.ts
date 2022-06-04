function isTicketChannel(guild, channel, db) {
  let result = null;
  if (db.has(`tickets_${guild.id}_ticketChannels`)) {
    if (db.get(`tickets_${guild.id}_ticketChannels`).includes(channel.id))
      result = true;
  }
  return result;
}

export { isTicketChannel };
