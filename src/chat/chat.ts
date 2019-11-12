import { Server, Socket } from "socket.io";
import { ICoords } from "../interfaces/chat.interface";
import { timeStampMessage } from "../utils/message";

// tslint:disable-next-line: no-var-requires
// tslint:disable-next-line: variable-name no-var-requires
const Filter = require("bad-words");

class Chat {
  private readonly io: Server;
  private readonly port: number | string;
  constructor(io: Server, port: number | string) {
    this.io = io;
    this.port = port;
    this.ioConnectionInitialize();
  }
  private ioConnectionInitialize() {
    // on hook for connecting websocket
    this.io.on("connection", (socket: SocketIO.Socket) => {
      // tslint:disable-next-line: no-console
      console.log(`connected client is on port ${this.port}`);
      this.sendingAllWelcomeMessage(socket);
      this.broadcastingMessageForJoinedUsers(socket);
      this.sendingBackMessageToAllUsers(socket);
      this.sendingDisconnectToAllUsers(socket);
      this.sendingBackLocationToAllUsers(socket);
    });
  }
  private sendingAllWelcomeMessage(socket: Socket) {
    // sending welcome message
    socket.emit(
      "welcomeMessage",
      timeStampMessage("welcome :) you are online")
    );
  }
  private broadcastingMessageForJoinedUsers(socket: Socket) {
    // broadcasting for new users
    socket.broadcast.emit("message", "new user have joined");
  }
  private sendingBackMessageToAllUsers(socket: Socket) {
    // sending message for all connection
    socket.on("submitMessage", (message, cb): (() => string) => {
      const filter = new Filter();
      if (filter.isProfane(message)) {
        return cb("Profanity is not allowed");
      }
      socket.broadcast.emit("message", timeStampMessage(message));
      cb(timeStampMessage(message).createdAt);
    });
  }
  private sendingDisconnectToAllUsers(socket: Socket) {
    // sending message for all connections
    socket.on("disconnect", () => {
      this.io.emit("message", timeStampMessage("a user has disconnected"));
    });
  }

  private sendingBackLocationToAllUsers(socket: Socket) {
    socket.on("shareLocationCoords", ({ latitude, longitude }: ICoords, cb) => {
      this.io.emit(
        "shareLocationCoords",
        timeStampMessage(`https://google.com/maps?q=${latitude},${longitude}`)
      );
      cb();
    });
  }
}

export default Chat;
