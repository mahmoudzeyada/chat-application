import {Server, Socket} from "socket.io";

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
    });
  }
  private sendingAllWelcomeMessage(socket: Socket) {
    // sending welcome message
    socket.emit("welcome", "welcome :)");
  }
  private broadcastingMessageForJoinedUsers(socket: Socket) {
       // broadcasting for new users
      socket.broadcast.emit("welcome", "new user have joined");
  }
  private sendingBackMessageToAllUsers(socket: Socket) {
    // sending message for all connection
    socket.on("submitMessage", (message) => {
      this.io.emit("welcome", message);
    });
  }
  private sendingDisconnectToAllUsers(socket: Socket) {
    // sending message for all connections
    socket.on("disconnect", () => {
      this.io.emit("welcome", "a user has disconnected");
    });
  }
}

export default Chat;
