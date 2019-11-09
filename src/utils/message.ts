import { IMessage } from "../interfaces/message.interface";
import * as moment from "moment";

export const timeStampMessage = (text: string): IMessage => {
  const now = new Date().getTime();
  const createdAt = moment(now).format("h:mm");
  return {
    text,
    createdAt
  };
};
