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
module.exports = {
    name: "start-tickets",
    description: "Start the ticket system",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        const embed = new discord_js_1.MessageEmbed()
            .setColor("BLUE")
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription("React to open a ticket")
            .setFooter("Fast and easy tickets", message.guild.iconURL({ dynamic: true }));
        let msg = yield message.channel.send(embed);
        msg.react("📩");
        let d = db.get(`tickets_${message.guild.id}`);
        let objToSave = {
            msgID: msg.id,
        };
        if (d) {
            if (d["num"])
                objToSave["num"] = d["num"];
        }
        db.set(`tickets_${message.guild.id}`, objToSave);
        db.save();
    }),
};
