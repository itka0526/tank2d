import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { serveGame } from "./functions/serveGame";
dotenv.config();

const PORT = process.env.PORT || 9192;
const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    socket.on("player_position", (evt) => {
        console.log(`${socket.id}:${evt}`);
        socket.broadcast.emit("other_player_position", evt);
    });
});

serveGame(app);

app.get("/static/connect.js", (_, res) => {
    res.setHeader("Content-Type", "javascript/text");
    res.sendFile(process.cwd() + "/static/connect.js");
});

server.listen(PORT, () => console.log(`Server is on port: ${PORT}`));
