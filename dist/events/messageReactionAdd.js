"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const generateID_1 = require("../functions/generateID");
module.exports = (client, db, reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (reaction.message.partial)
        yield reaction.message.fetch();
    if (reaction.partial)
        yield reaction.fetch();
    const { message } = reaction;
    if (user.bot)
        return;
    let data = db.get(`tickets_${message.guild.id}`);
    if (message.id !== data.msgID)
        return;
    if (db.has(`tickets_${message.guild.id}`)) {
        if (db.has(`tickets_${message.guild.id}_blacklists`)) {
            if (db.get(`tickets_${message.guild.id}_blacklists`).includes(user.id))
                return message.channel
                    .send(`
          <@${user.id}> You are blacklisted from the ticket system in this server
        `)
                    .then((msgYx) => msgYx.delete({ timeout: 5000 }));
        }
        if (db.has(`tickets_${message.guild.id}_curUsers`)) {
            if (db.get(`tickets_${message.guild.id}_curUsers`).includes(user.id)) {
                let ticketUserHas = null;
                let xc = db.get(`tickets_${message.guild.id}_userChannel`);
                xc.forEach((yt) => {
                    if (yt.user === user.id)
                        ticketUserHas = `<#${yt.channel}>`;
                });
                return message.channel
                    .send(`<@${user.id}> You already have a ticket in ${ticketUserHas}`)
                    .then((m) => m.delete({ timeout: 5000 }));
            }
        }
        if (db.has(`tickets_${message.guild.id}_category`)) {
            let category = db.get(`tickets_${message.guild.id}_category`);
            let overWrites = [];
            overWrites.push({
                id: message.guild.id,
                deny: ["SEND_MESSAGES", "VIEW_CHANNEL"],
            });
            overWrites.push({
                id: user.id,
                allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
            });
            if (db.has(`tickets_${message.guild.id}_staffRoles`)) {
                let staffRoles = db.get(`tickets_${message.guild.id}_staffRoles`);
                staffRoles.forEach((staffRole) => {
                    overWrites.push({
                        id: staffRole,
                        allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
                    });
                });
            }
            message.guild.channels
                .create(`ticket-${data.num ? data.num : 0}`, {
                parent: category,
                type: "text",
                permissionOverwrites: overWrites,
            })
                .then((x) => {
                db.set(`tickets_${message.guild.id}.num`, data.num ? data.num + 1 : 1);
                if (db.has(`tickets_${message.guild.id}_curUsers`)) {
                    db.push(`tickets_${message.guild.id}_curUsers`, user.id);
                }
                else {
                    db.set(`tickets_${message.guild.id}_curUsers`, [user.id]);
                }
                if (!db.has(`tickets_${message.guild.id}_ticketChannels`)) {
                    db.set(`tickets_${message.guild.id}_ticketChannels`, [x.id]);
                }
                else {
                    db.push(`tickets_${message.guild.id}_ticketChannels`, x.id);
                }
                if (!db.has(`tickets_${message.guild.id}_userChannel`)) {
                    db.set(`tickets_${message.guild.id}_userChannel`, [
                        {
                            user: user.id,
                            channel: x.id,
                        },
                    ]);
                }
                else {
                    db.push(`tickets_${message.guild.id}_userChannel`, {
                        user: user.id,
                        channel: x.id,
                    });
                }
                if (db.has(`tickets_${message.guild.id}_settings.save-logs`)) {
                    let genedID = generateID_1.generateID();
                    while (db.has(`save_logs_${message.guild.id}.${genedID}`)) {
                        genedID = generateID_1.generateID();
                    }
                    db.set(`save_logs_${message.guild.id}.${genedID}`, {
                        ticketOwnerID: user.id,
                        userAvatar: user.displayAvatarURL({ dynamic: true }),
                        ticketMade: new Date(),
                        ticketNum: data.num ? data.num : 0,
                        channelID: x.id,
                    });
                }
                db.save();
                x.send(`Welcome to your ticket <@${user.id}>`, new discord_js_1.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription("A new ticket has been opened")
                    .setFooter("Ticket created", message.guild.iconURL({ dynamic: true })));
            });
        }
    }
});
