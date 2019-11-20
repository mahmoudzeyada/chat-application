import { IMessage } from "../interfaces/message.interface";
import * as moment from "moment";
import { ICoords } from "../interfaces/chat.interface";

export const timeStampMessage = (text: string, username: string): IMessage => {
  const now = new Date().getTime();
  const createdAt = moment(now).format("h:mm a");
  return {
    text,
    createdAt,
    username
  };
};
