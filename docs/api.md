# TGVault API Reference

REST API for the TGVault backend. All sensitive operations are client-side; the API stores only encrypted blobs.

## Base URL

`/api/v1` (or as configured)

## Authentication

Requests to protected endpoints require a JWT in the header:

```
Authorization: Bearer <token>
```

Tokens are issued after Telegram WebApp init-data validation. See [webapp.md](./webapp.md) for auth flow.

## Endpoints

### Health

```
GET /health
```

No auth. Returns `{"status": "ok"}`.

---

### Get Vault

```
GET /vault
```

**Auth**: Required

**Response**:

```json
{
  "ciphertext": "base64-encoded encrypted vault blob",
  "version": 1,
  "updatedAt": "2025-01-15T12:00:00Z"
}
```

If no vault exists: `404` with empty body or `{"ciphertext": null}`.

---

### Put Vault

```
PUT /vault
Content-Type: application/json
```

**Auth**: Required

**Body**:

```json
{
  "ciphertext": "base64-encoded encrypted vault blob",
  "version": 1
}
```

**Response**: `200 OK` with `{"ok": true}` or updated vault metadata.

**Notes**:
- Server does not validate ciphertext structure; stores as opaque blob
- Last-write-wins; no conflict resolution

---

### Delete Vault

```
DELETE /vault
```

**Auth**: Required

**Response**: `204 No Content`

Permanently deletes the user's vault.

## Error Responses

| Status | Meaning                    |
| ------ | -------------------------- |
| 400    | Bad request (invalid body) |
| 401    | Unauthorized (invalid/missing JWT) |
| 404    | Resource not found         |
| 500    | Server error               |

Error body:

```json
{
  "detail": "Human-readable message"
}
```
