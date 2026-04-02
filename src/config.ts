import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBConfig;
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
};

function envOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}
