# TGVault
Zero-knowledge password manager for Telegram. KeePass-inspired vault design.

---
TG Vault is an open-source password manager that runs as a Telegram WebApp (Mini App).
Telegram and the server are treated as **untrusted**: secrets are encrypted/decrypted **on the client**.
The backend stores only **ciphertext** (zero-knowledge).

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

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

Commercial licensing is available upon request.
For commercial use without AGPL obligations, please contact me: ryu8777@gmail.com
