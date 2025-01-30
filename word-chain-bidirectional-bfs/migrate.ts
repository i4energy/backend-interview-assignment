// migrate.ts
import { join } from "oak/deps.ts";
import { closeSQLiteDB, getSQLiteDB } from "./database/db.ts";

const db = getSQLiteDB();

const MIGRATIONS_DIR = "./migrations";

const MIGRATIONS_TABLE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

/**
 * Retrieves a sorted list of migration file paths from the migrations directory.
 * @param directory The directory containing migration files.
 * @returns An array of migration file paths.
 */
async function getMigrationFiles(directory: string) {
  try {
    const migrationFiles: string[] = [];

    for await (const dirEntry of Deno.readDir(directory)) {
      if (
        dirEntry.isFile &&
        (dirEntry.name.endsWith(".sql"))
      ) {
        migrationFiles.push(join(directory, dirEntry.name));
      }
    }

    // Sort the migration files in ascending order (e.g., by prefix number or timestamp)
    migrationFiles.sort(); // Assumes filenames are prefixed to ensure correct order

    return migrationFiles;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`❌ Failed to read migration files: ${error.message}`);
    } else {
      console.log(`❌ Failed to read migration files: ${error.message}`);
    }
  }
}

try {
  // Ensure the migrations table exists
  db.query(MIGRATIONS_TABLE_SCHEMA);

  // List of migration files in order
  const migrationFiles = await getMigrationFiles(MIGRATIONS_DIR);

  if (!migrationFiles || migrationFiles.length === 0) {
    console.log("No migration files found. Exiting.");
  }

  for (const file of migrationFiles!) {
    const migrationName = file;

    // Check if migration has already been applied
    const result = [
      ...db.query("SELECT * FROM migrations WHERE name = ?", [
        migrationName,
      ]),
    ];

    const migrationResult = result[0];
    if (migrationResult) {
      console.log(`Migration already applied: ${file}`);
      continue;
    }

    // Read and execute the migration SQL
    const sql = await Deno.readTextFile(file);
    db.query(sql);
    console.log(`Executed migration: ${file}`);

    // Record the applied migration
    db.query("INSERT INTO migrations (name) VALUES (?)", [
      migrationName.split("\\").pop(),
    ]);
  }

  console.log("All migrations ran successfully.");
} catch (error) {
  console.error("Migration failed:", error);
} finally {
  closeSQLiteDB();
}
