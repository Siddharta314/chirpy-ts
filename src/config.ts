import type { MigrationConfig } from "drizzle-orm/migrator";
import { loadEnvFile } from "node:process";

loadEnvFile();

const rawPlatform = process.env.PLATFORM;
const platform =
  rawPlatform === "dev" || rawPlatform === "prod" ? rawPlatform : "prod";

type Config = {
  api: APIConfig;
  db: DBConfig;
  platform: "dev" | "prod";
  jwtSecret: string;
};

type APIConfig = {
  fileserverHits: number;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};
export const config: Config = {
  api: {
    fileserverHits: 0,
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig,
  },
  platform: platform,
  jwtSecret: envOrThrow("JWT_SECRET"),
};

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}
