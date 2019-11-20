"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class IndexRouter {
    constructor() {
        this.router = express.Router();
        this.path = "/";
        this.getIndex = (req, res) => {
            return res.render("index");
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(this.path, this.getIndex);
    }
}
exports.indexRouterObj = new IndexRouter();
//# sourceMappingURL=index.router.js.map