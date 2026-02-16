"""Backend API client for bot (e.g. future export/import via bot)."""

import httpx
from bot.config import get_config


async def health_check() -> bool:
    """Check if backend is reachable."""
    config = get_config()
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(f"{config.backend_url}/health", timeout=5.0)
            return r.status_code == 200
    except Exception:
        return False
