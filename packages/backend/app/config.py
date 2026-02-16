"""Application configuration from environment."""

import os
from functools import lru_cache


@lru_cache
def get_config():
    return Config()


class Config:
    """Configuration loaded from environment variables."""

    def __init__(self):
        self.database_url: str = os.getenv(
            "DATABASE_URL", "postgresql://tgvault:tgvault@localhost:5432/tgvault"
        )
        self.jwt_secret: str = os.getenv("JWT_SECRET", "")
        self.telegram_bot_token: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
        self.webapp_url: str = os.getenv("WEBAPP_URL", "")

    def validate(self) -> None:
        if not self.jwt_secret:
            raise ValueError("JWT_SECRET must be set")
        if not self.telegram_bot_token:
            raise ValueError("TELEGRAM_BOT_TOKEN must be set")
