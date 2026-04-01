import express, { Request, Response, NextFunction } from "express";
import {
  middlewareLogResponses,
  middlewareIncrementFileserverHits,
} from "./middleware.js";
import { handlerValidateChirp } from "./api.js";
import { config } from "./config.js";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "./customError.js";

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

app.use(errorHandler);

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

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
  } else if (err instanceof BadRequestError) {
    res.status(400).json({ error: err.message });
  } else if (err instanceof UnauthorizedError) {
    res.status(401).json({ error: err.message });
  } else if (err instanceof ForbiddenError) {
    res.status(403).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
