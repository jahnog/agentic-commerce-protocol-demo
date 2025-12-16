import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Initialize the connection pool for PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Drizzle with the connection pool and schema
export const db = drizzle(pool, { schema });

// Run migrations on startup
let migrationPromise: Promise<void> | null = null;

export async function runMigrations() {
  if (!migrationPromise) {
    migrationPromise = (async () => {
      console.log("Running migrations...");
      try {
        await migrate(db, { migrationsFolder: "./drizzle" });
        console.log("Migrations completed successfully!");
      } catch (error) {
        console.error("Migration failed:", error);
        throw error;
      }
    })();
  }
  return migrationPromise;
}

// Auto-run migrations in development
if (process.env.NODE_ENV !== "production") {
  runMigrations().catch(console.error);
} 