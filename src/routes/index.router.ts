import * as express from "express";
import { IRouter } from "../interfaces/router.interface";

class IndexRouter implements IRouter {
  public path: string = "/";
  public router: express.Router = express.Router();
  constructor() {
    this.initializeRoutes();
  }
  public initializeRoutes() {
    this.router.get(this.path, this.getIndex);
  }
  private getIndex = (req: express.Request, res: express.Response) => {
    return res.render("index");
  }

}

export const indexRouterObj = new IndexRouter();
