# TGVault Self-Hosting Guide

Run TGVault on your own infrastructure with Docker Compose.

## Prerequisites

- Docker and Docker Compose
- Domain with HTTPS (required for Telegram WebApp)
- Telegram Bot (via [@BotFather](https://t.me/BotFather))

## 1. Clone and Configure

```bash
git clone https://github.com/your-org/tg-vault.git
cd tg-vault
cp .env.example .env
```

Edit `.env`:

| Variable       | Description                          | Example                    |
| -------------- | ------------------------------------ | -------------------------- |
| `BOT_TOKEN`    | Telegram bot token from BotFather    | `123456:ABC-DEF...`        |
| `WEBAPP_URL`   | Full URL of the WebApp               | `https://vault.example.com`|
| `JWT_SECRET`   | Secret for signing JWTs (random)     | 64+ char random string     |
| `DATABASE_URL` | Postgres connection string           | `postgresql://...`         |
| `BACKEND_URL`  | Internal backend URL for nginx       | `http://backend:8000`      |

## 2. Start Services

```bash
docker compose -f infra/docker-compose.yml up -d --build
```

This starts:

- **Postgres** — Database
- **Backend** — FastAPI API server
- **Bot** — Telegram bot
- **Nginx** — Reverse proxy, serves WebApp and proxies API

## 3. Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Set WebApp domain: BotFather → `/setdomain` → your domain (e.g. `vault.example.com`)
3. Ensure WebApp URL matches `WEBAPP_URL` in `.env`

## 4. Build and Deploy WebApp

Build the WebApp:

```bash
cd packages/webapp
pnpm install
pnpm build
```

Copy `dist/` to the location nginx serves (e.g. mount into container or rsync to server).

## 5. Verify

- Open your bot in Telegram → `/start` → "Open Vault"
- WebApp should load; enter master password to create vault

## Development Mode

Use `infra/docker-compose.dev.yml` for local development:

```bash
docker compose -f infra/docker-compose.dev.yml up -d
```

Runs Postgres and optionally backend/bot; WebApp runs via `pnpm dev` with hot reload.

## Troubleshooting

- **WebApp not loading**: Check `WEBAPP_URL` and domain in BotFather
- **401 Unauthorized**: Verify `JWT_SECRET` is consistent; initData may be expired (restart WebApp)
- **Database errors**: Ensure Postgres is up and `DATABASE_URL` is correct
