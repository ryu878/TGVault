# TGVault
Zero-knowledge password manager for Telegram. KeePass-inspired vault design.

---
TG Vault is an open-source password manager that runs as a Telegram WebApp (Mini App).
Telegram and the server are treated as **untrusted**: secrets are encrypted/decrypted **on the client**.
The backend stores only **ciphertext** (zero-knowledge).

## Project Structure

```bash
tg-vault/
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml
│  │  ├─ codeql.yml
│  │  └─ release.yml
│  ├─ ISSUE_TEMPLATE/
│  │  ├─ bug_report.md
│  │  └─ feature_request.md
│  └─ PULL_REQUEST_TEMPLATE.md
│
├─ docs/
│  ├─ threat-model.md
│  ├─ crypto-design.md
│  ├─ vault-format.md
│  ├─ api.md
│  ├─ webapp.md
│  └─ self-hosting.md
│
├─ infra/
│  ├─ docker-compose.yml
│  ├─ docker-compose.dev.yml
│  ├─ nginx/
│  │  ├─ nginx.conf
│  │  └─ sites-enabled/
│  │     └─ tg-vault.conf
│  └─ postgres/
│     └─ init.sql
│
├─ packages/
│  ├─ common/
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  └─ src/
│  │     ├─ types.ts
│  │     ├─ schema.ts
│  │     └─ constants.ts
│  │
│  ├─ crypto/
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  └─ src/
│  │     ├─ index.ts
│  │     ├─ kdf.ts
│  │     ├─ aead.ts
│  │     ├─ vault.ts
│  │     ├─ totp.ts
│  │     └─ encoding.ts
│  │
│  ├─ webapp/
│  │  ├─ package.json
│  │  ├─ vite.config.ts
│  │  ├─ index.html
│  │  ├─ public/
│  │  │  ├─ icon.svg
│  │  │  └─ manifest.json
│  │  └─ src/
│  │     ├─ main.tsx
│  │     ├─ app.tsx
│  │     ├─ tg/
│  │     │  ├─ init.ts
│  │     │  └─ auth.ts
│  │     ├─ api/
│  │     │  ├─ client.ts
│  │     │  └─ vault.ts
│  │     ├─ store/
│  │     │  ├─ vaultStore.ts
│  │     │  └─ settingsStore.ts
│  │     ├─ ui/
│  │     │  ├─ components/
│  │     │  ├─ pages/
│  │     │  │  ├─ Unlock.tsx
│  │     │  │  ├─ Vault.tsx
│  │     │  │  ├─ EntryEdit.tsx
│  │     │  │  └─ Settings.tsx
│  │     │  └─ styles.css
│  │     └─ utils/
│  │        ├─ clipboard.ts
│  │        └─ lockTimer.ts
│  │
│  ├─ backend/
│  │  ├─ pyproject.toml
│  │  ├─ Dockerfile
│  │  ├─ alembic.ini
│  │  ├─ migrations/
│  │  │  ├─ env.py
│  │  │  └─ versions/
│  │  └─ app/
│  │     ├─ main.py
│  │     ├─ config.py
│  │     ├─ db.py
│  │     ├─ models.py
│  │     ├─ schemas.py
│  │     ├─ auth/
│  │     │  ├─ telegram.py
│  │     │  └─ tokens.py
│  │     ├─ routes/
│  │     │  ├─ health.py
│  │     │  └─ vault.py
│  │
│  └─ bot/
│     ├─ pyproject.toml
│     ├─ Dockerfile
│     └─ bot/
│        ├─ main.py
│        ├─ config.py
│        ├─ handlers/
│        │  ├─ start.py
│        │  ├─ help.py
│        │  └─ export.py
│        ├─ keyboards/
│        │  └─ webapp.py
│        └─ services/
│           └─ backend_api.py
│
├─ .env.example
├─ .editorconfig
├─ .gitignore
├─ LICENSE
├─ SECURITY.md
├─ CODE_OF_CONDUCT.md
├─ CONTRIBUTING.md
├─ README.md
└─ Makefile
```

## Features
- Password vault (create / view / edit / search)
- TOTP (2FA) generated locally in the WebApp
- One encrypted vault blob synced via backend (no Dropbox)
- Self-host friendly (Docker Compose)

## Security model (read first)
- Your **master password never leaves your device**
- Vault is encrypted locally using:
  - KDF: Argon2id
  - AEAD: XChaCha20-Poly1305
- Backend stores only ciphertext + minimal metadata

⚠️ Limitations:
- Does not protect against malware/keyloggers on your device
- Telegram bots are not end-to-end encrypted; we rely on client-side crypto

See: `docs/threat-model.md` and `docs/crypto-design.md`.

## Repository layout
- `packages/webapp` — Telegram WebApp (client-side crypto + UI)
- `packages/bot` — Telegram bot (entry point + export helpers)
- `packages/backend` — API for storing encrypted vault blobs
- `packages/crypto` — shared crypto package (KDF/AEAD/TOTP)
- `infra/` — docker-compose + nginx + postgres

## Quick start (self-host)
### 1) Configure environment
Copy `.env.example` to `.env` and set:
- `BOT_TOKEN`
- `WEBAPP_URL`
- `JWT_SECRET`
- Postgres credentials

### 2) Run with Docker
```bash
docker compose -f infra/docker-compose.yml up -d --build
```
### 3) Telegram bot setup

Create a bot via @BotFather

Set WebApp domain (BotFather -> /setdomain) to your WEBAPP_URL domain

Open chat with your bot -> /start -> "Open Vault"

## Development
### WebApp

Requires **Node.js 18+** (e.g. `nvm use` if using `.nvmrc`).

```bash
cd packages/webapp
pnpm i
pnpm dev
```

### Backend

```bash
cd packages/backend
# run locally or via docker-compose.dev.yml
```

### Bot

```bash
cd packages/bot
# run locally or via docker-compose.dev.yml
```

## Contributing

PRs welcome. Please read CONTRIBUTING.md.
Security issues: see SECURITY.md.

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

Commercial licensing is available upon request.
For commercial use without AGPL obligations, please contact me: ryu8777@gmail.com
