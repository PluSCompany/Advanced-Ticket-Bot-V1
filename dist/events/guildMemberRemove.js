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
const deleteUser_1 = require("../functions/deleteUser");
const { fetchTranscript } = require("reconlx");
module.exports = (client, db, member) => {
    let { guild } = member;
    let cc = db.get(`tickets_${guild.id}_userChannel`);
    if (db.has(`tickets_${guild.id}_curUsers`)) {
        db.splice(`tickets_${guild.id}_curUsers`, member.id);
    }
    if (cc) {
        cc.forEach((obj) => {
            if (obj.user === member.id) {
                let ch = guild.channels.cache.get(obj.channel);
                guild.channels.cache
                    .get(obj.channel)
                    .send(new discord_js_1.MessageEmbed()
                    .setColor("RED")
                    .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
                    .setDescription("The ticket owner has left the server"))
                    .then((msg) => {
                    deleteUser_1.deleteUser(guild, member.id, db);
                    ["❌", "📰"].forEach((e) => {
                        msg.react(e);
                    });
                    client.on("messageReactionAdd", (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
                        if (reaction.message.partial)
                            yield reaction.message.fetch();
                        if (reaction.partial)
                            yield reaction.fetch();
                        if (user.bot)
                            return;
                        let { message } = reaction;
                        if (reaction.emoji.name === "❌") {
                            ch.delete();
                        }
                        else if (reaction.emoji.name === "📰") {
                            let m = yield message.reply(`Please wait well he transcript is generated..`);
                            fetchTranscript(message, 99).then((data) => {
                                const file = new discord_js_1.MessageAttachment(data, "index.html");
                                message.channel.send(file).then(() => {
                                    m.delete();
                                });
                            });
                        }
                    }));
                });
            }
        });
    }
    db.save();
};
