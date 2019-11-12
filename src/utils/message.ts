import { IMessage } from "../interfaces/message.interface";
import * as moment from "moment";
import { ICoords } from "../interfaces/chat.interface";

export const timeStampMessage = (text: string): IMessage => {
  const now = new Date().getTime();
  const timeInNumbers = moment(now).format("h:mm a");
  const timeFromNow = moment(now).fromNow();
  const createdAt = `${timeInNumbers} | ${timeFromNow}`;
  return {
    text,
    createdAt
  };
};
