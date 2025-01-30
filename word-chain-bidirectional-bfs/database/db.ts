import { DB } from "sqlite/mod.ts";
import { config } from "dotenv/mod.ts";

const env = config();
const DB_PATH = env.DB_PATH || "./data/sqlite.db";

await Deno.mkdir("./data", { recursive: true });

// Singleton database instance
let dbInstance: DB | null = null;

// Function to get the database instance
export function getSQLiteDB(): DB {
  if (!dbInstance) {
    dbInstance = new DB(DB_PATH);
    console.log("SQLite database connected.");
  }
  return dbInstance;
}

// Function to gracefully close the database connection
export function closeSQLiteDB(): void {
  if (dbInstance) {
    dbInstance.close();
    console.log("SQLite database connection closed.");
    dbInstance = null;
  }
}
