"""Pytest fixtures for bot tests."""

import os

os.environ.setdefault("BOT_TOKEN", "test-token")
os.environ.setdefault("WEBAPP_URL", "https://example.com")
os.environ.setdefault("BACKEND_URL", "http://localhost:8000")
