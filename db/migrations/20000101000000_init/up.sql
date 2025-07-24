CREATE SCHEMA crude;

CREATE TABLE crude.migrations (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    down_sql TEXT,
    UNIQUE (name)
);
