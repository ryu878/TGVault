"""Vault endpoint tests - require auth."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_vault_unauthorized(client: AsyncClient):
    """GET /api/v1/vault without token returns 401."""
    response = await client.get("/api/v1/vault")
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_vault_invalid_token(client: AsyncClient):
    """GET /api/v1/vault with invalid token returns 401."""
    response = await client.get(
        "/api/v1/vault",
        headers={"Authorization": "Bearer invalid-token"},
    )
    assert response.status_code == 401
