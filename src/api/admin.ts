import { config } from "../config.js";
import { Request, Response } from "express";
import { Router } from "express";

export const adminRouter = Router();

adminRouter.get("/metrics", handlerMetrics);
adminRouter.post("/reset", handlerReset);

function handlerMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`);
}

function handlerReset(req: Request, res: Response) {
  config.api.fileserverHits = 0;
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}
