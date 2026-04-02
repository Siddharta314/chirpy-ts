import { config } from "../config.js";
import { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { ForbiddenError } from "../customError.js";
import { deleteAllUsers } from "../db/queries/users.js";
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

async function handlerReset(req: Request, res: Response, next: NextFunction) {
  try {
    if (config.platform !== "dev") {
      throw new ForbiddenError("Reset is only allowed in dev mode");
    }
    config.api.fileserverHits = 0;
    await deleteAllUsers();
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
  } catch (error) {
    next(error);
  }
}
