import { sign, verify } from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

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
      exp: iat + expiresIn,
    } satisfies payload,
    secret,
    {
      expiresIn,
    },
  );
}

export function validateJWT(tokenString: string, secret: string): string {
  return verify(tokenString, secret) as string;
}

export function getBearerToken(req: Request): string {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("Authorization header is missing");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("Bearer token is missing");
  }
  return token;
}
