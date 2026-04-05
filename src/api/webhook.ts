import { NextFunction, Request, Response, Router } from "express";
import { upgradeUserChirp } from "../db/queries/users.js";
import { getAPIKey } from "../auth/index.js";
import { config } from "../config.js";
import { UnauthorizedError } from "../customError.js";
export const webhookRouter = Router();

webhookRouter.post("/polka/webhooks", handlerPolkaWebhook);

type requestPolkaWebhook = {
  event: "user.upgraded";
  data: {
    userId: string;
  };
};

async function handlerPolkaWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params: requestPolkaWebhook = req.body;
    const apiKey = getAPIKey(req);
    if (apiKey !== config.polkaKey) {
      throw new UnauthorizedError("Invalid API Polka key");
    }
    if (params.event !== "user.upgraded") {
      return res.status(204).send();
    }

    const { userId } = params.data;
    const result = await upgradeUserChirp(userId);
    if (result.length === 0) {
      return res.status(404).send();
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}
