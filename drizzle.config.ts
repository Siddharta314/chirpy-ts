import { defineConfig } from "drizzle-kit";

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error("DB_URL is not defined");
}

export default defineConfig({
  schema: "src/db/schema.ts",
  out: "src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
  },
});
