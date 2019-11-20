"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
exports.timeStampMessage = (text, username) => {
    const now = new Date().getTime();
    const createdAt = moment(now).format("h:mm a");
    return {
        text,
        createdAt,
        username
    };
};
//# sourceMappingURL=message.js.map