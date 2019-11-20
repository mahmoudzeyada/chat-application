"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = require("../utils/message");
const usersDb_1 = require("../utils/usersDb");
const errors_interface_1 = require("../interfaces/errors.interface");
// tslint:disable-next-line: no-var-requires
// tslint:disable-next-line: variable-name no-var-requires
const Filter = require("bad-words");
class Chat {
    constructor(io, port) {
        this.chatDb = usersDb_1.userDb;
        this.io = io;
        this.port = port;
        this.ioConnectionInitialize();
    }
    ioConnectionInitialize() {
        // on hook for connecting websocket
        this.io.on("connection", (socket) => {
            // tslint:disable-next-line: no-console
            console.log(`connected client is on port ${this.port}`);
            // on event join
            socket.on("join", (userData, cb) => {
                // adding user to chatDb
                const user = this.chatDb.addUser(Object.assign({ id: socket.id }, userData));
                // if error is occurred
                if (errors_interface_1.isErrorType(user)) {
                    return cb(user);
                }
                // making new room or joining existing room
                socket.join(user.room);
                // sending welcome message to the same socket
                this.sendingAllWelcomeMessage(socket, user.username);
                // broadcasting the joined message to the same room
                this.broadcastingMessageForJoinedUsers(socket, user);
                // emit event roomData to all sockets in the room
                this.initializeRoomDataEvent(user.room);
                cb();
            });
            this.sendingBackMessageToAllUsers(socket);
            this.sendingDisconnectToAllUsers(socket);
            this.sendingBackLocationToAllUsers(socket);
        });
    }
    sendingAllWelcomeMessage(socket, username) {
        // sending welcome message
        socket.emit("welcomeMessage", `welcome ${username} :) you are online`);
    }
    broadcastingMessageForJoinedUsers(socket, userData) {
        // broadcasting for new users in the room
        socket.broadcast
            .to(userData.room)
            .emit("message", message_1.timeStampMessage(`${userData.username} have joined`, "Admin"));
    }
    sendingBackMessageToAllUsers(socket) {
        // sending message for all connection
        socket.on("submitMessage", (message, cb) => {
            // getting the user
            const user = this.chatDb.getUserById(socket.id);
            // validating user
            if (!errors_interface_1.isErrorType(user)) {
                const filter = new Filter();
                if (filter.isProfane(message)) {
                    return cb("Profanity is not allowed");
                }
                socket.broadcast
                    .to(user.room)
                    .emit("message", message_1.timeStampMessage(message, user.username));
                cb(message_1.timeStampMessage(message, user.username).createdAt);
            }
            // there is a case when user did not actually in db
            // TODO handle redirecting the user to join page to login again
            // i will handel it from backend
        });
    }
    sendingDisconnectToAllUsers(socket) {
        // sending message for all connections
        socket.on("disconnect", () => {
            const user = this.chatDb.removeUserByID(socket.id);
            if (!errors_interface_1.isErrorType(user)) {
                this.io
                    .to(user.room)
                    .emit("message", message_1.timeStampMessage(`${user.username}user has disconnected`, user.username));
                // emit event roomData to all sockets in the room
                this.initializeRoomDataEvent(user.room);
            }
        });
    }
    sendingBackLocationToAllUsers(socket) {
        socket.on("shareLocationCoords", ({ latitude, longitude }, cb) => {
            const user = this.chatDb.getUserById(socket.id);
            if (!errors_interface_1.isErrorType(user)) {
                socket.emit("shareLocationCoords", message_1.timeStampMessage(`https://google.com/maps?q=${latitude},${longitude}`, user.username));
                socket.broadcast
                    .to(user.room)
                    .emit("message", message_1.timeStampMessage(`https://google.com/maps?q=${latitude},${longitude}`, user.username));
                cb();
                // there is a case when user did not actually in db
                // TODO handle redirecting the user to join page to login again
                // i will handel it from backend
            }
        });
    }
    initializeRoomDataEvent(room) {
        this.io
            .to(room)
            .emit("roomData", {
            recentRoom: room,
            users: this.chatDb.getUsersInRoom(room)
        });
    }
}
exports.default = Chat;
//# sourceMappingURL=chat.js.map