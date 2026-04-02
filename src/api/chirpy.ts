import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../customError.js";
import { Router } from "express";

export const chirpyRouter = Router();

type body = {
  body: string;
};

type response = { cleanedBody: string } | { error: string };

chirpyRouter.post("/", handlerCreateChirp);

function handlerCreateChirp(req: Request, res: Response, next: NextFunction) {
  let body = "";
  const profaneWords = ["kerfuffle", "sharbert", "fornax"];
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    res.header("Content-Type", "application/json");
    try {
      const parsedBody = JSON.parse(body) as body;
      if (typeof parsedBody.body !== "string") {
        throw new BadRequestError("String expected");
      }
      if (parsedBody.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
      }

      const cleanedBody = parsedBody.body
        .split(" ")
        .map((word) => {
          if (profaneWords.includes(word.toLowerCase())) {
            return "****";
          }
          return word;
        })
        .join(" ");
      const successResponse: response = { cleanedBody };
      res.status(200).send(JSON.stringify(successResponse));
      return;
    } catch (error) {
      next(error);
    }
  });
}
