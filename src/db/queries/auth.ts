import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createRefreshToken(token: string, userId: string) {
  const expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // 60 days
  const [result] = await db
    .insert(refreshTokens)
    .values({ token, userId, expiresAt })
    .returning();
  return result;
}

export async function getRefreshToken(token: string) {
  const result = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token))
    .limit(1);
  return result[0];
}

export async function revokeRefreshToken(token: string) {
  await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, token));
}
