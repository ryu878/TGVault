"""Bot configuration."""

import os
from functools import lru_cache


@lru_cache
def get_config():
    return Config()


class Config:
    def __init__(self):
        self.bot_token: str = os.getenv("BOT_TOKEN", "")
        self.webapp_url: str = os.getenv("WEBAPP_URL", "")
        self.backend_url: str = os.getenv("BACKEND_URL", "http://localhost:8000")
