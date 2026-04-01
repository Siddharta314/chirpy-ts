import { NextFunction, Request, Response } from "express";
type body = {
  body: string;
};

type response = { cleanedBody: string } | { error: string };

export function handlerValidateChirp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
        const errorResponse: response = { error: "Something went wrong" };
        return res.status(400).send(JSON.stringify(errorResponse));
      }
      if (parsedBody.body.length > 140) {
        throw new Error("Chirp is too long");
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
