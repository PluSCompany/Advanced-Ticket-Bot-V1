"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateID = void 0;
function generateID() {
    let abcs = "abcdefghijklmnopqrstadpoasmdAIPSOdjdjackmxvkobsdojpajpdcoANFDAIPOCNSAqjhauposfbwuoipfnsaipoNDFuqpofnapofklSANFwpoquifndaklfsdfljkasdbnusovbsipfwjapofsbndfjksbnfwi";
    let chars = abcs.split("");
    let ID = Math.floor(Math.random() * 100) +
        chars[Math.floor(Math.random() * chars.length)] +
        chars[Math.floor(Math.random() * chars.length)] +
        chars[Math.floor(Math.random() * chars.length)] +
        Math.floor(Math.random() * 100);
    return ID;
}
exports.generateID = generateID;
