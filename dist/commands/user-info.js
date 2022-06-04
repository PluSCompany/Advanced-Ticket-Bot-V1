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
const isTicketChannel_1 = require("../functions/isTicketChannel");
const ticketOwner_1 = require("../functions/ticketOwner");
const moment_1 = __importDefault(require("moment"));
module.exports = {
    name: "user-info",
    description: "Get information about the owner of a ticket",
    run: (client, message, args, db) => __awaiter(void 0, void 0, void 0, function* () {
        if (!isTicketChannel_1.isTicketChannel(message.guild, message.channel, db))
            return;
        let owner = ticketOwner_1.ticketOwner(message.guild, message.channel, db);
        let user = yield client.users.fetch(owner);
        let member = yield message.guild.members.fetch(owner);
        const embed = new discord_js_1.MessageEmbed()
            .setColor("RED")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addField("Tag", user.tag)
            .addField("ID", user.id)
            .addField("Joined server", moment_1.default(member.joinedAt).fromNow())
            .addField("Created account", moment_1.default(user.createdAt).fromNow())
            .addField("Roles", member.roles.cache.map((role) => `<@&${role.id}>`))
            .addField("Server acknowledgements", member.id === message.guild.ownerID
            ? "Server owner"
            : member.hasPermission("ADMINISTRATOR")
                ? "Admin"
                : member.hasPermission("MANAGE_MESSAGES")
                    ? "Moderator"
                    : "Member");
        message.channel.send(embed);
    }),
};
