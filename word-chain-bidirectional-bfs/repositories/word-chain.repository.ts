import { getSQLiteDB } from "../database/db.ts";

export interface LogEntry {
  startWord: string;
  endWord: string;
  solution: string[];
  elapsedTimeMs: number;
  status: string;
  error?: string;
}

const db = getSQLiteDB();

export const wordChainRepository = {
  insertLog: (log: LogEntry) => {
    const { startWord, endWord, solution, elapsedTimeMs, status, error } = log;
    db.query(
      "INSERT INTO logs (id, start_word, end_word, solution, elapsed_time_ms,status,  error) VALUES (?, ?, ?, ?, ?, ?, ?);",
      [
        crypto.randomUUID(),
        startWord,
        endWord,
        JSON.stringify(solution),
        elapsedTimeMs,
        status,
        error,
      ],
    );
  },
};
