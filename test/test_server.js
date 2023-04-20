import express, { json } from "express";
import { join } from "path";
import { writeFileSync, existsSync, readFileSync } from "fs";
import * as url from "url";

const app = express();

app.use(express.static(url.fileURLToPath(new URL("./public", import.meta.url))));
app.use("/docs", express.static(url.fileURLToPath(new URL("../docs", import.meta.url))));
app.use("/candle", express.static(url.fileURLToPath(new URL("../../candle/src", import.meta.url))));
app.get("/ping", (req, res) => {
    res.json("pong");
})

app.use(json());

app.post("/snapshot", (req, res) => {
    const data = req.body.data;
    const filename = req.body.filename;
    const filepath = join(url.fileURLToPath(new URL("./snapshots", import.meta.url)), filename);
    const updateSnapshots = req.body.updateSnapshots;

    let returnData;
    if (updateSnapshots) {
        writeFileSync(filepath, data);
        returnData = data;
    } else if (existsSync(filepath)) {
        returnData = readFileSync(filepath, "utf8");
    } else {
        returnData = "";
    }
    res.json({
        data: returnData,
    });
})

const port = 5000;
console.log(`Go to: http://localhost:${port}`);
app.listen(port);
