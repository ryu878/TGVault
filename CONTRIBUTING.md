# Contributing to TGVault

Thank you for your interest in contributing!

## Development Setup

1. **Clone and install**

   ```bash
   git clone https://github.com/your-org/tg-vault.git
   cd tg-vault
   pnpm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set `BOT_TOKEN`, `WEBAPP_URL`, `JWT_SECRET`, and Postgres credentials.

3. **Run services**

   ```bash
   docker compose -f infra/docker-compose.dev.yml up -d  # Postgres
   cd packages/webapp && pnpm dev
   cd packages/backend && uvicorn app.main:app --reload
   cd packages/bot && python -m bot.main
   ```

## Project Structure

- `packages/webapp` — React/Vite WebApp (client-side crypto)
- `packages/backend` — FastAPI API (stores ciphertext only)
- `packages/bot` — Telegram bot
- `packages/crypto` — Shared crypto (KDF, AEAD, TOTP)
- `packages/common` — Shared types and constants
- `infra/` — Docker Compose, nginx, postgres
- `docs/` — Documentation

## Pull Requests

1. Fork the repo and create a branch from `master`
2. Make your changes; ensure tests pass and lint is clean
3. Fill out the PR template
4. Request review

## Code Style

- **TypeScript**: Use the project's tsconfig; prefer `const` and strict types
- **Python**: Follow PEP 8; use type hints where appropriate
- **Security**: Never log or transmit the master password or derived keys

## Documentation

Update relevant docs in `docs/` when changing behavior, APIs, or configuration.
