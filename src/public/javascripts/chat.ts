import { compileMessages } from "./utils/compileMessages";
import * as $ from "jquery";
import "bootstrap-notify";
import "./utils/emojipicker";
const socket = io();

// variables
$(document).ready(() => {
  const $outGoingMessagesTemplate = $("#outGoingMessagesTemplate").html();
  const $inGoingMessagesTemplate = $("#inGoingMessagesTemplate").html();
  const $locationTemplate = $("#shareLocationTemplate").html();
  const $shareLocationButton = $("#messageForm button[name=location]");

  socket.on("shareLocationCoords", (message: IMessage) => {
    console.log(message);
    compileMessages(
      $locationTemplate,
      message.createdAt,
      message.text,
      $(".msg_history")
    );
  });

  // welcome event
  socket.on("welcomeMessage", (message: IMessage) => {
    $.notify({
      icon: "fa fa-bell-o",
      message: message.text
    });
  });

  // message event
  socket.on("message", (message: IMessage) => {
    compileMessages(
      $inGoingMessagesTemplate,
      message.createdAt,
      message.text,
      $(".msg_history")
    );
  });

  $("#messageForm").on("submit", e => {
    e.preventDefault();
    const inputValue = $("#emojiArea").val() as string;
    if (inputValue === "") {
      return;
    }
    // disable submit button
    $("#messageForm button[name=submit]").attr("disabled", "true");
    socket.emit("submitMessage", inputValue, (ack: string) => {
      // enable button
      $("#messageForm button[name=submit]").removeAttr("disabled");
      $("#emojiArea")
        .val("")
        .change();
      $("#emojiArea").focus();
      if (ack === "Profanity is not allowed") {
        return console.log(ack);
      }
      compileMessages(
        $outGoingMessagesTemplate,
        ack,
        inputValue,
        $(".msg_history")
      );
    });
  });

  $shareLocationButton.on("click", () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser :(");
    }
    // disable share location button
    $shareLocationButton.attr("disabled", "disabled");
    navigator.geolocation.getCurrentPosition((position: Position) => {
      console.log(position);
      socket.emit(
        "shareLocationCoords",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        (errorAck: string) => {
          // enable share location button
          $shareLocationButton.removeAttr("disabled");
          if (errorAck) {
            return console.log(errorAck);
          }
          return console.log("location Shared!!");
        }
      );
    });
  });
});
