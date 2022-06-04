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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const moment_1 = __importDefault(require("moment"));
module.exports = {
    name: "logs",
    run: (client, message, args, db) => {
        if (!db.has(`tickets_${message.guild.id}_settings.save-logs`))
            return message.channel.send("Logs are not enabled");
        let settingsData = db.get(`tickets_${message.guild.id}_settings.save-logs`);
        if (settingsData.func !== true)
            return message.channel.send("Logs are not enabled");
        if (!args[0]) {
            let logData = db.get(`save_logs_${message.guild.id}`);
            let embed = new discord_js_1.MessageEmbed()
                .setColor("BLUE")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
            let str = "";
            Object.keys(logData).map((key) => __awaiter(void 0, void 0, void 0, function* () {
                let obj = logData[key];
                let owner = yield client.users.fetch(obj["ticketOwnerID"]);
                str += `\n\n${key} | ${owner.tag}\n${moment_1.default(obj["ticketMade"]).fromNow()} - Ticket number: ${obj["ticketNum"]}`;
            }));
            message.channel.send("Fetching data...").then(() => {
                setTimeout(() => {
                    embed.setDescription(str);
                    message.channel.send(embed);
                }, 2000);
            });
        }
        else {
            let ID = args[0];
            let logData = db.get(`save_logs_${message.guild.id}.${ID}`);
            if (!logData)
                return message.channel.send("Invalid log ID given");
            let embed = new discord_js_1.MessageEmbed()
                .setColor("BLUE")
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
            let str = "";
            let tOwner;
            let obj = {};
            Object.keys(logData).map((piece) => __awaiter(void 0, void 0, void 0, function* () {
                obj[piece] = logData[piece];
            }));
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                tOwner = obj["ticketOwnerID"];
                let owner = yield client.users.fetch(obj["ticketOwnerID"]);
                str += `${ID} | ${owner.tag}\n${moment_1.default(obj["ticketMade"]).fromNow()} - Ticket number: ${obj["ticketNum"]}`;
            }), 1000);
            message.channel.send("Fetching data...").then(() => {
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    let owner = yield client.users.fetch(tOwner);
                    if (str.length > 2000) {
                        str = str.replace(str.slice(2000), "...");
                    }
                    embed
                        .setTitle("ID: " + ID)
                        .addField("User info:", `ID: ${owner.id}\nUsername: ${owner.username}\nCreated account: ${moment_1.default(owner.createdAt).fromNow()}`)
                        .addField("Ticket info", `Channel ID: ${obj["channelID"]}\nTicket active: ${message.guild.channels.cache.has(obj["channelID"])}\nTicket number: ${obj["ticketNum"]}\nCreated at: ${moment_1.default(obj["ticketMade"]).fromNow()}`);
                    message.channel.send(embed);
                }), 2000);
            });
        }
    },
};
