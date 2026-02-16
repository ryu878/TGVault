"""Pydantic schemas for API request/response."""

from datetime import datetime
from pydantic import BaseModel, Field


class VaultPut(BaseModel):
    """Request body for PUT /vault."""

    ciphertext: str = Field(..., description="Base64-encoded encrypted vault blob")
    version: int = Field(1, ge=1, description="Vault format version")


class VaultResponse(BaseModel):
    """Response for GET /vault."""

    ciphertext: str
    version: int
    updatedAt: datetime

    class Config:
        from_attributes = True
