import jwt from "jsonwebtoken";

const { sign, verify } = jwt;
import type { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { UnauthorizedError } from "../customError.js";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): string {
  const iat = Math.floor(Date.now() / 1000);
  return sign(
    {
      sub: userID,
      iss: "chirpy",
      iat,
    } satisfies payload,
    secret,
    {
      expiresIn,
    },
  );
}

/*
async version!
export async function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { sub: userID, iss: "chirpy" },
      secret,
      { expiresIn },
      (err, token) => {
        if (err || !token) return reject(err);
        resolve(token);
      }
    );
  });
}
*/

export function validateJWT(tokenString: string, secret: string): string {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(tokenString, secret) as JwtPayload;
  } catch {
    throw new UnauthorizedError("Invalid token");
  }

  if (payload.iss !== "chirpy") {
    throw new UnauthorizedError("Invalid issuer");
  }
  if (!payload.sub) {
    throw new UnauthorizedError("No user ID in token");
  }
  return payload.sub;
}

export function getBearerToken(req: Request): string {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new Error("Authorization header is missing");
  }
  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization header is not a Bearer token");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Bearer token is missing");
  }
  return token;
}
