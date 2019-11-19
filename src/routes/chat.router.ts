import * as express from "express";
import { IRouter } from "../interfaces/router.interface";

class ChatRouter implements IRouter {
  public router = express.Router();
  public readonly path = "/chat";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getChat);
  }

  private getChat = (req: express.Request, res: express.Response) => {
    return res.render("chat");
  };
}

export const chatRouterObj = new ChatRouter();
