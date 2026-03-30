import express from "express";
import { Request, Response } from "express";
import {
  middlewareLogResponses,
  middlewareIncrementFileserverHits,
} from "./middleware.js";
import { config } from "./config.js";

const app = express();
const PORT = 8080;

app.use(
  "/app",
  middlewareLogResponses,
  middlewareIncrementFileserverHits,
  express.static("./src/app"),
);

app.get("/healthz", handlerReadiness);

app.get("/metrics", handlerMetrics);

app.get("/reset", handlerReset);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}

function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(`fileserverHits: ${config.fileserverHits}`);
}

function handlerReset(req: Request, res: Response) {
  config.fileserverHits = 0;
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}
