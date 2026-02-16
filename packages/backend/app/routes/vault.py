"""Vault CRUD endpoints."""

import base64
from fastapi import APIRouter, Depends, HTTPException, Header, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import Vault
from app.schemas import VaultPut, VaultResponse
from app.auth.tokens import decode_token

router = APIRouter(prefix="/vault", tags=["vault"])


async def get_current_user_id(authorization: str | None = Header(None)) -> int:
    """Extract and validate user ID from Authorization Bearer token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization")
    token = authorization[7:].strip()
    user_id = decode_token(token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user_id


@router.get("", response_model=VaultResponse)
async def get_vault(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get encrypted vault blob for current user."""
    result = await db.execute(select(Vault).where(Vault.telegram_user_id == user_id))
    vault = result.scalar_one_or_none()
    if vault is None:
        raise HTTPException(status_code=404, detail="Vault not found")

    return VaultResponse(
        ciphertext=base64.b64encode(vault.ciphertext).decode("ascii"),
        version=vault.version,
        updatedAt=vault.updated_at,
    )


@router.put("")
async def put_vault(
    body: VaultPut,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Create or update encrypted vault blob."""
    try:
        ciphertext_bytes = base64.b64decode(body.ciphertext)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 ciphertext")

    result = await db.execute(select(Vault).where(Vault.telegram_user_id == user_id))
    vault = result.scalar_one_or_none()
    if vault:
        vault.ciphertext = ciphertext_bytes
        vault.version = body.version
    else:
        vault = Vault(
            telegram_user_id=user_id,
            ciphertext=ciphertext_bytes,
            version=body.version,
        )
        db.add(vault)
    await db.commit()
    return {"ok": True}


@router.delete("", status_code=204)
async def delete_vault(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Delete vault for current user."""
    result = await db.execute(select(Vault).where(Vault.telegram_user_id == user_id))
    vault = result.scalar_one_or_none()
    if vault:
        await db.delete(vault)
        await db.commit()
