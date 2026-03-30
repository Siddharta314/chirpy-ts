import { Request, Response, NextFunction } from "express";
import { config } from "./config.js";

export function middlewareLogResponses(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.on("finish", () => {
    if (res.statusCode !== 200) {
      console.log(
        `[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`,
      );
    }
  });

  next();
}

export function middlewareIncrementFileserverHits(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  config.fileserverHits++;
  next();
}
