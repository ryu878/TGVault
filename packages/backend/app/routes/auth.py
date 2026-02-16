"""Auth endpoints - exchange Telegram initData for JWT."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.auth.telegram import validate_telegram_init_data
from app.auth.tokens import create_token

router = APIRouter(prefix="/auth", tags=["auth"])


class AuthRequest(BaseModel):
    initData: str


class AuthResponse(BaseModel):
    token: str


@router.post("/login", response_model=AuthResponse)
async def login(body: AuthRequest):
    """Exchange Telegram WebApp initData for JWT."""
    user = validate_telegram_init_data(body.initData)
    if user is None:
        raise HTTPException(status_code=401, detail="Invalid init data")
    telegram_user_id = user.get("id")
    if not telegram_user_id:
        raise HTTPException(status_code=401, detail="Invalid user data")
    token = create_token(telegram_user_id)
    return AuthResponse(token=token)
