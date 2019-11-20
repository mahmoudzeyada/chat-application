"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mustache = require("mustache");
exports.compileMessages = (template, createdAt, text, container, username) => {
    const html = Mustache.render(template, {
        text,
        createdAt,
        username
    });
    container.append(html);
    // animation to scroll bottom
    container.animate({
        scrollTop: document.querySelector(".msg_history").scrollHeight -
            document.querySelector(".msg_history").clientHeight
    }, 500);
};
//# sourceMappingURL=compileMessages.js.map