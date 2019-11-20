"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
require("jquery-textcomplete");
require("emojione");
require("emojionearea");
$(document).ready(() => {
    $("#emojiArea").emojioneArea({
        pickerPosition: "top",
        filtersPosition: "bottom",
        tones: false,
        autocomplete: false,
        inline: true,
        hidePickerOnBlur: false
    });
});
//# sourceMappingURL=emojipicker.js.map