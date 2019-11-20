import { Server, Socket } from "socket.io";
import { ICoords } from "../interfaces/chat.interface";
import { timeStampMessage } from "../utils/message";
import { userDb } from "../utils/usersDb";
import { IUserData } from "../interfaces/userData.interface";
import { IError, isErrorType } from "../interfaces/errors.interface";

// tslint:disable-next-line: no-var-requires
// tslint:disable-next-line: variable-name no-var-requires
const Filter = require("bad-words");

class Chat {
  private readonly io: Server;
  private readonly port: number | string;
  private chatDb = userDb;
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

      // on event join
      socket.on("join", (userData: IUserData, cb) => {
        // adding user to chatDb
        const user = this.chatDb.addUser({ id: socket.id, ...userData });

        // if error is occurred
        if (isErrorType(user)) {
          return cb(user as IError);
        }
        // making new room or joining existing room
        socket.join(user.room);
        // sending welcome message to the same socket
        this.sendingAllWelcomeMessage(socket, user.username);
        // broadcasting the joined message to the same room
        this.broadcastingMessageForJoinedUsers(socket, user as IUserData);
        // emit event roomData to all sockets in the room
        this.initializeRoomDataEvent(user.room);
        cb();
      });
      this.sendingBackMessageToAllUsers(socket);
      this.sendingDisconnectToAllUsers(socket);
      this.sendingBackLocationToAllUsers(socket);
    });
  }
  private sendingAllWelcomeMessage(socket: Socket, username: string) {
    // sending welcome message
    socket.emit("welcomeMessage", `welcome ${username} :) you are online`);
  }
  private broadcastingMessageForJoinedUsers(
    socket: Socket,
    userData: IUserData
  ) {
    // broadcasting for new users in the room
    socket.broadcast
      .to(userData.room)
      .emit(
        "message",
        timeStampMessage(`${userData.username} have joined`, "Admin")
      );
  }
  private sendingBackMessageToAllUsers(socket: Socket) {
    // sending message for all connection
    socket.on("submitMessage", (message, cb): (() => string) => {
      // getting the user
      const user = this.chatDb.getUserById(socket.id);
      // validating user
      if (!isErrorType(user)) {
        const filter = new Filter();
        if (filter.isProfane(message)) {
          return cb("Profanity is not allowed");
        }
        socket.broadcast
          .to(user.room)
          .emit("message", timeStampMessage(message, user.username));
        cb(timeStampMessage(message, user.username).createdAt);
      }
      // there is a case when user did not actually in db
      // TODO handle redirecting the user to join page to login again
      // i will handel it from backend
    });
  }
  private sendingDisconnectToAllUsers(socket: Socket) {
    // sending message for all connections
    socket.on("disconnect", () => {
      const user = this.chatDb.removeUserByID(socket.id);
      if (!isErrorType(user)) {
        this.io
          .to(user.room)
          .emit(
            "message",
            timeStampMessage(
              `${user.username}user has disconnected`,
              user.username
            )
          );
        // emit event roomData to all sockets in the room
        this.initializeRoomDataEvent(user.room);
      }
    });
  }

  private sendingBackLocationToAllUsers(socket: Socket) {
    socket.on("shareLocationCoords", ({ latitude, longitude }: ICoords, cb) => {
      const user = this.chatDb.getUserById(socket.id);
      if (!isErrorType(user)) {
        socket.emit(
          "shareLocationCoords",
          timeStampMessage(
            `https://google.com/maps?q=${latitude},${longitude}`,
            user.username
          )
        );
        socket.broadcast
          .to(user.room)
          .emit(
            "message",
            timeStampMessage(
              `https://google.com/maps?q=${latitude},${longitude}`,
              user.username
            )
          );
        cb();
        // there is a case when user did not actually in db
        // TODO handle redirecting the user to join page to login again
        // i will handel it from backend
      }
    });
  }

  private initializeRoomDataEvent(room: string): void {
    this.io
      .to(room)
      .emit("roomData", {
        recentRoom: room,
        users: this.chatDb.getUsersInRoom(room)
      });
  }
}

export default Chat;
