"""Telegram WebApp init data validation."""

import hashlib
import hmac
from urllib.parse import parse_qsl

from app.config import get_config


def validate_telegram_init_data(init_data: str) -> dict | None:
    """
    Validate Telegram WebApp initData and extract user info.
    Returns parsed user dict if valid, else None.
    """
    config = get_config()
    token = config.telegram_bot_token
    if not token:
        return None

    try:
        parsed = dict(parse_qsl(init_data))
        received_hash = parsed.pop("hash", None)
        if not received_hash:
            return None

        data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(parsed.items()))
        secret_key = hmac.new(
            b"WebAppData",
            token.encode(),
            hashlib.sha256
        ).digest()
        calculated_hash = hmac.new(
            secret_key,
            data_check_string.encode(),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(calculated_hash, received_hash):
            return None

        import json
        user_str = parsed.get("user")
        if not user_str:
            return None
        user = json.loads(user_str)
        return user
    except Exception:
        return None
