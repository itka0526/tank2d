"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const serveGame_1 = require("./functions/serveGame");
dotenv_1.default.config();
const PORT = process.env.PORT || 9192;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
io.on("connection", (socket) => {
    socket.on("player_position", (evt) => {
        console.log(`${socket.id}:${evt}`);
        socket.broadcast.emit("other_player_position", evt);
    });
});
(0, serveGame_1.serveGame)(app);
app.get("/static/connect.js", (_, res) => {
    res.setHeader("Content-Type", "javascript/text");
    res.sendFile(process.cwd() + "/static/connect.js");
});
server.listen(PORT, () => console.log(`Server is on port: ${PORT}`));
