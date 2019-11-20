"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compileMessages_1 = require("./utils/compileMessages");
const $ = require("jquery");
const qs = require("query-string");
require("bootstrap-notify");
require("./utils/emojipicker");
const Mustache = require("mustache");
const socket = io();
$(document).ready(() => {
    // variables
    const $outGoingMessagesTemplate = $("#outGoingMessagesTemplate").html();
    const $inGoingMessagesTemplate = $("#inGoingMessagesTemplate").html();
    const $locationTemplate = $("#shareLocationTemplate").html();
    const $chatListTemplate = $("#chatList").html();
    const $shareLocationButton = $("#messageForm button[name=location]");
    const { username, room } = qs.parse(location.search);
    console.log($chatListTemplate);
    // emit join event
    socket.emit("join", { username, room }, (ack) => {
        if (ack) {
            alert(ack.error);
            location.href = "/";
        }
    });
    // Share Location Event
    socket.on("shareLocationCoords", (message) => {
        console.log(message);
        compileMessages_1.compileMessages($locationTemplate, message.createdAt, message.text, $(".msg_history"));
    });
    // welcome event
    socket.on("welcomeMessage", (text) => {
        $.notify({
            icon: "fa fa-bell-o",
            message: text
        });
    });
    // message event
    socket.on("message", (message) => {
        compileMessages_1.compileMessages($inGoingMessagesTemplate, message.createdAt, message.text, $(".msg_history"), message.username);
    });
    // roomData event
    socket.on("roomData", ({ recentRoom, users }) => {
        const html = Mustache.render($chatListTemplate, { recentRoom, users });
        $(".inbox_people").html(html);
        // animation to scroll bottom
        $(".inbox_people").animate({
            scrollTop: document.querySelector(".msg_history").scrollHeight -
                document.querySelector(".msg_history").clientHeight
        }, 500);
    });
    // form actions
    $("#messageForm").on("submit", e => {
        e.preventDefault();
        const inputValue = $("#emojiArea").val();
        if (inputValue === "") {
            return;
        }
        // disable submit button
        $("#messageForm button[name=submit]").attr("disabled", "true");
        socket.emit("submitMessage", inputValue, (ack) => {
            // enable button
            $("#messageForm button[name=submit]").removeAttr("disabled");
            $("#emojiArea")
                .val("")
                .change();
            $("#emojiArea").focus();
            if (ack === "Profanity is not allowed") {
                return $.notify({
                    icon: "fa fa-bell-o",
                    message: ack
                });
            }
            compileMessages_1.compileMessages($outGoingMessagesTemplate, ack, inputValue, $(".msg_history"));
        });
    });
    // location button actions
    $shareLocationButton.on("click", () => {
        if (!navigator.geolocation) {
            return alert("Geolocation is not supported by your browser :(");
        }
        // disable share location button
        $shareLocationButton.attr("disabled", "disabled");
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            socket.emit("shareLocationCoords", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, (errorAck) => {
                // enable share location button
                $shareLocationButton.removeAttr("disabled");
                if (errorAck) {
                    return console.log(errorAck);
                }
                return console.log("location Shared!!");
            });
        });
    });
});
//# sourceMappingURL=chat.js.map