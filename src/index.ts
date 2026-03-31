import express from "express";
import { Request, Response } from "express";
import {
  middlewareLogResponses,
  middlewareIncrementFileserverHits,
} from "./middleware.js";
import { handlerValidateChirp } from "./api.js";
import { config } from "./config.js";

const app = express();
const PORT = 8080;

app.use(
  "/app",
  middlewareLogResponses,
  middlewareIncrementFileserverHits,
  express.static("./src/app"),
);

app.get("/api/healthz", handlerReadiness);

app.get("/admin/metrics", handlerMetrics);

app.post("/admin/reset", handlerReset);

app.post("/api/validate_chirp", handlerValidateChirp);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}

function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
}

function handlerReset(req: Request, res: Response) {
  config.fileserverHits = 0;
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}
