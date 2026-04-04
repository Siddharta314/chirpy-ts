import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../customError.js";
import { Router } from "express";
import { createChirp, getChirps, getChirpById } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth/jwt.js";
import { config } from "../config.js";

export const chirpyRouter = Router();

type body = {
  body: string;
};

chirpyRouter.post("/", handlerCreateChirp);
chirpyRouter.get("/", handlerGetChirps);
chirpyRouter.get("/:id", handlerGetChirpById);

async function handlerCreateChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const profaneWords = ["kerfuffle", "sharbert", "fornax"];
  try {
    const { body } = req.body;
    const jwt = getBearerToken(req);
    const userId = validateJWT(jwt, config.jwtSecret);
    if (typeof body !== "string") {
      throw new BadRequestError("Missing values");
    }
    if (body.length > 140) {
      throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const cleanedBody = body
      .split(" ")
      .map((word) => {
        if (profaneWords.includes(word.toLowerCase())) {
          return "****";
        }
        return word;
      })
      .join(" ");
    const newChirp = await createChirp({
      body: cleanedBody,
      userId,
    });
    res.status(201).send(JSON.stringify(newChirp));
    return;
  } catch (error) {
    next(error);
  }
}

async function handlerGetChirps(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const chirps = await getChirps();
    res.status(200).send(JSON.stringify(chirps));
    return;
  } catch (error) {
    next(error);
  }
}

async function handlerGetChirpById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params as { id: string };
    const chirp = await getChirpById(id);

    if (!chirp[0]) {
      throw new NotFoundError("Chirp not found");
    }
    res.status(200).send(JSON.stringify(chirp[0]));
    return;
  } catch (error) {
    next(error);
  }
}

/*
  req.on("end", async () => {
    res.header("Content-Type", "application/json");
    try {
      const parsedBody = JSON.parse(body) as body;
      if (
        typeof parsedBody.body !== "string" ||
        typeof parsedBody.userId !== "string"
      ) {
        throw new BadRequestError("Missing values");
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
      const newChirp = await createChirp({
        body: cleanedBody,
        userId: parsedBody.userId,
      });
      res.status(201).send(JSON.stringify(newChirp));
      return;
    } catch (error) {
      next(error);
    }
  });
*/
