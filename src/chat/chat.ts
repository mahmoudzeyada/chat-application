import { Server, Socket } from "socket.io";
import { ICoords } from "../interfaces/chat.interface";

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
    socket.emit("message", "welcome :)");
  }
  private broadcastingMessageForJoinedUsers(socket: Socket) {
    // broadcasting for new users
    socket.broadcast.emit("message", "new user have joined");
  }
  private sendingBackMessageToAllUsers(socket: Socket) {
    // sending message for all connection
    socket.on("submitMessage", message => {
      this.io.emit("message", message);
    });
  }
  private sendingDisconnectToAllUsers(socket: Socket) {
    // sending message for all connections
    socket.on("disconnect", () => {
      this.io.emit("message", "a user has disconnected");
    });
  }

  private sendingBackLocationToAllUsers(socket: Socket) {
    socket.on("shareLocationCoords", ({ latitude, longitude }: ICoords) => {
      socket.broadcast.emit(
        "message",
        `https://google.com/maps?q=${latitude},${longitude}`
      );
    });
  }
}

export default Chat;
