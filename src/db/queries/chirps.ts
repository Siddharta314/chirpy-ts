import { db } from "../index.js";
import { NewChirp, chirps, Chirp } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db.insert(chirps).values(chirp).returning();
  return result;
}

export async function getChirps() {
  const result = await db.select().from(chirps).orderBy(chirps.createdAt);
  return result;
}

export async function getChirpById(id: string): Promise<Chirp | null> {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
  return result ?? null;
}

export async function deleteChirp(id: string) {
  const result = await db.delete(chirps).where(eq(chirps.id, id));
  return result;
}
