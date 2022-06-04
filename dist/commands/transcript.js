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
const isStaff_1 = require("../functions/isStaff");
const isTicketChannel_1 = require("../functions/isTicketChannel");
const ticketOwner_1 = require("../functions/ticketOwner");
const reconlx_1 = require("reconlx");
const discord_js_1 = require("discord.js");
module.exports = {
    name: "transcript",
    description: "Create a transcript of a ticket",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        if (!isTicketChannel_1.isTicketChannel(message.guild, message.channel, db))
            return message.channel.send("This is not a ticket channel");
        let owner = ticketOwner_1.ticketOwner(message.guild, message.channel, db);
        if (!isStaff_1.isStaff(message.guild, message.member, db) &&
            owner !== message.author.id)
            return message.reply("You are not a staff member");
        let msg = yield message.channel.send("Generating transcript..");
        reconlx_1.fetchTranscript(message, 99).then((data) => {
            message.channel
                .send(new discord_js_1.MessageAttachment(data, "index.html"))
                .then(() => {
                msg.delete();
            });
        });
    }),
};
