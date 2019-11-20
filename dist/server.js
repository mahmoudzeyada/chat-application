"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boom = require("@hapi/boom");
const express = require("express");
const http_1 = require("http");
const logger = require("morgan");
const path = require("path");
const socketIo = require("socket.io");
const chat_1 = require("./chat/chat");
const index_router_1 = require("./routes/index.router");
const chat_router_1 = require("./routes/chat.router");
class ChatServer {
    constructor() {
        this._app = express();
        this.port = process.env.PORT || ChatServer.PORT;
        this.server = http_1.createServer(this._app);
        this._app.use(express.static(ChatServer.publicDirectoryPath));
        this._app.use(logger("dev"));
        this.initTemplateEngine();
        this.initRouters();
        this.shortCutLinks();
        this.initializeCustomErrorHandler();
        this.initSocket();
        this.listen();
    }
    initRouters() {
        this._app.use(index_router_1.indexRouterObj.router);
        this._app.use(chat_router_1.chatRouterObj.router);
    }
    initTemplateEngine() {
        this._app.set("views", ChatServer.viewsDirectoryPath);
        this._app.set("view engine", "pug");
    }
    initSocket() {
        this.io = socketIo(this.server);
    }
    initializeCustomErrorHandler() {
        // catch 404 and forward to error handler
        this._app.use((req, res, next) => {
            next(boom.notFound("sorry this page not found"));
        });
        // custom error handler
        this._app.use((err, req, res, next) => {
            if (err.isServer) {
                // tslint:disable-next-line: no-console
                console.log(err);
            }
            console.log(err);
            res.status(err.output.statusCode).json(err.output.payload);
        });
    }
    shortCutLinks() {
        const pathCssEmojiArea = path.join(__dirname, "../node_modules/emojionearea/dist/emojionearea.min.css");
        const pathCssEmojiOne = path.join(__dirname, "../node_modules/emojione/extras/css/emojione.min.css");
        this._app.use("/pathCssEmojiArea", express.static(pathCssEmojiArea));
        this._app.use("/pathCssEmojiOne", express.static(pathCssEmojiOne));
    }
    listen() {
        this.server.listen(this.port, () => {
            // tslint:disable-next-line: no-console
            console.log(`server running on port ${this.port}`);
        });
        // initialize websocket connection
        const chat = new chat_1.default(this.io, this.port);
    }
    get app() {
        return this._app;
    }
}
exports.ChatServer = ChatServer;
ChatServer.PORT = 8080;
ChatServer.publicDirectoryPath = path.join(__dirname, "public");
ChatServer.viewsDirectoryPath = path.join(__dirname, "../views");
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
//# sourceMappingURL=server.js.map