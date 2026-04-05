import { hash, verify } from "argon2";
import { UnauthorizedError } from "src/customError";

export async function hashPassword(password: string): Promise<string> {
  return hash(password);
}

export async function checkPasswordHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return verify(hash, password);
}

export function getAPIKey(req: Request): string {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    throw new UnauthorizedError("Missing polka authorization");
  }
  if (!authHeader.startsWith("ApiKey ")) {
    throw new UnauthorizedError("Invalid polka authorization");
  }
  const apiKey = authHeader.split(" ")[1];
  if (!apiKey) {
    throw new UnauthorizedError("Missing API key");
  }
  return apiKey;
}
