import * as boom from "@hapi/boom";
import * as express from "express";
import { createServer, Server } from "http";
import * as logger from "morgan";
import * as path from "path";
import * as socketIo from "socket.io";
import Chat from "./chat/chat";
import * as config from "../config.json";
import { indexRouterObj } from "./routes/index.router";
import { chatRouterObj } from "./routes/chat.router";
export class ChatServer {
  public static readonly PORT: number = 8080;
  public static readonly publicDirectoryPath: string = path.join(
    __dirname,
    "public"
  );
  public static readonly viewsDirectoryPath: string = path.join(
    __dirname,
    "../views"
  );
  private _app: express.Application;
  private server: Server;
  private io: socketIo.Server;
  private port: string | number;
  constructor() {
    this._app = express();
    this.port = config.port || ChatServer.PORT;
    this.server = createServer(this._app);
    this._app.use(express.static(ChatServer.publicDirectoryPath));
    this._app.use(logger("dev"));
    this.initTemplateEngine();
    this.initRouters();
    this.shortCutLinks();
    this.initializeCustomErrorHandler();
    this.initSocket();
    this.listen();
  }
  private initRouters(): void {
    this._app.use(indexRouterObj.router);
    this._app.use(chatRouterObj.router);
  }
  private initTemplateEngine(): void {
    this._app.set("views", ChatServer.viewsDirectoryPath);
    this._app.set("view engine", "pug");
  }
  private initSocket(): void {
    this.io = socketIo(this.server);
  }
  private initializeCustomErrorHandler(): void {
    // catch 404 and forward to error handler
    this._app.use((req, res, next) => {
      next(boom.notFound("sorry this page not found"));
    });
    // custom error handler
    this._app.use(
      (
        err: boom.Boom,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        if (err.isServer) {
          // tslint:disable-next-line: no-console
          console.log(err);
        }
        console.log(err);
        res.status(err.output.statusCode).json(err.output.payload);
      }
    );
  }
  private shortCutLinks(): void {
    const pathCssEmojiArea = path.join(
      __dirname,
      "../node_modules/emojionearea/dist/emojionearea.min.css"
    );

    const pathCssEmojiOne = path.join(
      __dirname,
      "../node_modules/emojione/extras/css/emojione.min.css"
    );

    this._app.use("/pathCssEmojiArea", express.static(pathCssEmojiArea));
    this._app.use("/pathCssEmojiOne", express.static(pathCssEmojiOne));
  }
  private listen(): void {
    this.server.listen(this.port, () => {
      // tslint:disable-next-line: no-console
      console.log(`server running on port ${this.port}`);
    });
    // initialize websocket connection
    const chat = new Chat(this.io, this.port);
  }
  get app(): express.Application {
    return this._app;
  }
}
// var app = express();
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(boom.notFound('sorry this page not found'));
// });
// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });
// module.exports = app;
