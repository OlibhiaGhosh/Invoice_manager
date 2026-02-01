import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",   // where your schema lives
  out: "./drizzle",               // where to store migrations
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // Neon connection string
  },
});
