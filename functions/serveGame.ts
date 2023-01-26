import { Express } from "express";
import fs from "fs";
import path from "path";

export const GAME_FILE_PATH = process.cwd() + "/static/tank2d";

export function serveGame(app: Express) {
    app.get("/", (_, res) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream(GAME_FILE_PATH + "/index.html").pipe(res);
    });

    try {
        const directories = fs.readdirSync(GAME_FILE_PATH);
        const files = directories
            .map((dir) => !dir.includes(".") && fs.readdirSync(`${GAME_FILE_PATH}/${dir}`).map((file) => `/${dir}/${file}`))
            .flat(1);
        const map_to_endpoint = (file_path: string | false, ...rest: any) => {
            if (!file_path) return;
            app.get(file_path, (_, res) => {
                if (file_path.endsWith(".wasm.gz")) {
                    res.writeHead(200, {
                        "Content-Encoding": "gzip",
                        "Content-Type": "application/wasm",
                    });
                } else if (file_path.endsWith(".gz")) {
                    res.writeHead(200, {
                        "Content-Encoding": "gzip",
                        "Content-Type": "application/javascript",
                    });
                } else if (file_path.endsWith(".wasm.br")) {
                    res.writeHead(200, {
                        "Content-Encoding": "br",
                        "Content-Type": "application/wasm",
                    });
                } else if (file_path.endsWith(".br")) {
                    res.writeHead(200, {
                        "Content-Encoding": "br",
                        "Content-Type": "application/javascript",
                    });
                }
                fs.createReadStream(path.join(GAME_FILE_PATH, file_path)).pipe(res);
            });
            rest;
        };
        files.map(map_to_endpoint);
    } catch (error) {
        console.error(error);
    }
}
