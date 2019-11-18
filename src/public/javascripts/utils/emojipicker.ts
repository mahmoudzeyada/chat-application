import * as $ from "jquery";
import "jquery-textcomplete";
import "emojione";
import "emojionearea";

$(document).ready(() => {
  ($("#emojiArea") as any).emojioneArea({
    pickerPosition: "top",
    filtersPosition: "bottom",
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: false
  });
});
