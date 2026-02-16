"""JWT token creation and validation."""

import jwt
from datetime import datetime, timedelta

from app.config import get_config


def create_token(telegram_user_id: int) -> str:
    """Create JWT for authenticated user."""
    config = get_config()
    payload = {
        "sub": str(telegram_user_id),
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(days=7),
    }
    return jwt.encode(payload, config.jwt_secret, algorithm="HS256")


def decode_token(token: str) -> int | None:
    """Decode JWT and return telegram_user_id, or None if invalid."""
    config = get_config()
    try:
        payload = jwt.decode(token, config.jwt_secret, algorithms=["HS256"])
        return int(payload.get("sub", 0))
    except jwt.InvalidTokenError:
        return None
