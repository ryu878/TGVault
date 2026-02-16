# TGVault WebApp

The TGVault WebApp is a Telegram Mini App that provides the password vault UI and performs all client-side cryptography.

## Architecture

- **Framework**: React + Vite
- **State**: Zustand (vault, settings)
- **Crypto**: `@packages/crypto` (shared with backend tooling if needed)

## Telegram Integration

### Init Data

Telegram sends `initData` (URL-encoded string) when opening the WebApp. It contains:

- `user` — Telegram user info (id, first_name, etc.)
- `auth_date` — Unix timestamp
- `hash` — HMAC-SHA256 of initData with bot token

The backend validates `initData` and issues a JWT. The WebApp never sees the bot token.

### Telegram Web App API

Used for:

- `Telegram.WebApp.ready()` — Signal that the app is ready
- `Telegram.WebApp.expand()` — Expand to full height
- `Telegram.WebApp.MainButton` — Custom button for actions
- `Telegram.WebApp.close()` — Close the Mini App

## Pages

| Route      | Component  | Description                    |
| ---------- | ---------- | ------------------------------ |
| `/unlock`  | Unlock     | Master password input          |
| `/`        | Vault      | Entry list, search, add        |
| `/entry/:id` | EntryEdit | Create/edit entry              |
| `/settings`  | Settings  | Lock timeout, theme, export    |

## Security Considerations

1. **No master password transmission**: Only used locally for KDF
2. **Lock timer**: Auto-lock after inactivity
3. **Clipboard**: Clear after paste (configurable)
4. **No persistence of keys**: Key derived on unlock; cleared on lock

## Building

```bash
cd packages/webapp
pnpm install
pnpm build
```

Output: `dist/` — static assets to serve from WEBAPP_URL.
