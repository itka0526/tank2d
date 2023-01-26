"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveGame = exports.GAME_FILE_PATH = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.GAME_FILE_PATH = process.cwd() + "/static/tank2d";
function serveGame(app) {
    app.get("/", (_, res) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        fs_1.default.createReadStream(exports.GAME_FILE_PATH + "/index.html").pipe(res);
    });
    try {
        const directories = fs_1.default.readdirSync(exports.GAME_FILE_PATH);
        const files = directories
            .map((dir) => !dir.includes(".") && fs_1.default.readdirSync(`${exports.GAME_FILE_PATH}/${dir}`).map((file) => `/${dir}/${file}`))
            .flat(1);
        const map_to_endpoint = (file_path, ...rest) => {
            if (!file_path)
                return;
            app.get(file_path, (_, res) => {
                if (file_path.endsWith(".wasm.gz")) {
                    res.writeHead(200, {
                        "Content-Encoding": "gzip",
                        "Content-Type": "application/wasm",
                    });
                }
                else if (file_path.endsWith(".gz")) {
                    res.writeHead(200, {
                        "Content-Encoding": "gzip",
                        "Content-Type": "application/javascript",
                    });
                }
                else if (file_path.endsWith(".wasm.br")) {
                    res.writeHead(200, {
                        "Content-Encoding": "br",
                        "Content-Type": "application/wasm",
                    });
                }
                else if (file_path.endsWith(".br")) {
                    res.writeHead(200, {
                        "Content-Encoding": "br",
                        "Content-Type": "application/javascript",
                    });
                }
                fs_1.default.createReadStream(path_1.default.join(exports.GAME_FILE_PATH, file_path)).pipe(res);
            });
            rest;
        };
        files.map(map_to_endpoint);
    }
    catch (error) {
        console.error(error);
    }
}
exports.serveGame = serveGame;
