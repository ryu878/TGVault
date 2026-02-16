-- TGVault Postgres initialization
-- Run on first container start

-- Extensions (if needed)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vaults table: stores encrypted blobs per Telegram user
CREATE TABLE IF NOT EXISTS vaults (
    id SERIAL PRIMARY KEY,
    telegram_user_id BIGINT NOT NULL UNIQUE,
    ciphertext BYTEA NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vaults_telegram_user_id ON vaults(telegram_user_id);
