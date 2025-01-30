CREATE TABLE IF NOT EXISTS logs (
    id TEXT PRIMARY KEY,
    start_word VARCHAR(100) NOT NULL,
    end_word VARCHAR(100) NOT NULL,
    solution TEXT[],
    elapsed_time_ms INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT,
    error TEXT
);