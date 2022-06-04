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
const deleteTicket_1 = require("../functions/deleteTicket");
const isStaff_1 = require("../functions/isStaff");
const isTicketChannel_1 = require("../functions/isTicketChannel");
const reOpenTicket_1 = require("../functions/reOpenTicket");
const ticketOwner_1 = require("../functions/ticketOwner");
const { fetchTranscript } = require("reconlx");
module.exports = {
    name: "close",
    description: "Close a opened ticket",
    run: (client, message, args, db) => {
        if (!isTicketChannel_1.isTicketChannel(message.guild, message.channel, db))
            return;
        if (!isStaff_1.isStaff(message.guild, message.member, db))
            return message.channel.send("You are not a staff member");
        const closeEmbed = new discord_js_1.MessageEmbed()
            .setColor("BLUE")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription("❌ - Delete\n📰 - Transcript\n📂 - Reopen");
        message.channel.send(closeEmbed).then((msg) => {
            let owner = ticketOwner_1.ticketOwner(message.guild, message.channel, db);
            db.has(`tickets_${message.guild.id}_closed`)
                ? db.push(`tickets_${message.guild.id}_closed`, message.channel.id)
                : db.set(`tickets_${message.guild.id}_closed`, [message.channel.id]),
                [message.channel.id];
            message.channel.updateOverwrite(owner, {
                VIEW_CHANNEL: false,
            });
            if (db.has(`tickets_${message.guild.id}_closeCategory`)) {
                let categoryID = db.get(`tickets_${message.guild.id}_closeCategory`);
                try {
                    message.channel.setParent(categoryID).catch(() => { });
                }
                catch (_a) { }
            }
            ["❌", "📰", "📂"].forEach((e) => {
                msg.react(e);
            });
            client.on("messageReactionAdd", (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
                if (reaction.message.partial)
                    yield reaction.message.fetch();
                if (reaction.partial)
                    yield reaction.fetch();
                if (user.bot)
                    return;
                if (user.id !== message.author.id)
                    return;
                if (reaction.message.id !== msg.id)
                    return;
                if (reaction.emoji.name === "❌") {
                    deleteTicket_1.deleteTicket(message, db);
                }
                else if (reaction.emoji.name === "📰") {
                    let m = yield message.reply(`Please wait well the transcript is generated..`);
                    fetchTranscript(message, 99).then((data) => {
                        const file = new discord_js_1.MessageAttachment(data, "index.html");
                        message.channel
                            .send(file)
                            .catch(() => { })
                            .then(() => {
                            m.delete().catch(() => { });
                        })
                            .catch(() => { });
                    });
                }
                else if (reaction.emoji.name === "📂") {
                    reOpenTicket_1.reOpenTicket(message.guild, message.channel, message, db);
                }
            }));
        });
        db.save();
    },
};
