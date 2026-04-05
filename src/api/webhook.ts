import { Request, Response, Router } from "express";
import { upgradeUserChirp } from "../db/queries/users.js";

export const webhookRouter = Router();

webhookRouter.post("/polka/webhooks", handlerPolkaWebhook);

type requestPolkaWebhook = {
  event: "user.upgraded";
  data: {
    userId: string;
  };
};

async function handlerPolkaWebhook(
  req: Request<requestPolkaWebhook>,
  res: Response,
) {
  const { event } = req.body;
  if (event !== "user.upgraded") {
    return res.status(204).send();
  }
  const { userId } = req.body.data;
  const result = await upgradeUserChirp(userId);
  console.log(result);
  if (result.length === 0) {
    return res.status(404).send();
  }
  res.status(204).send();
}
