import { Request, Response } from "express";
import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/healthz", handlerReadiness);

function handlerReadiness(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("OK");
}
