"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class ChatRouter {
    constructor() {
        this.router = express.Router();
        this.path = "/chat";
        this.getChat = (req, res) => {
            return res.render("chat");
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getChat);
    }
}
exports.chatRouterObj = new ChatRouter();
//# sourceMappingURL=chat.router.js.map