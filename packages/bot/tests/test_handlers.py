"""Bot handler tests."""

import pytest
from unittest.mock import AsyncMock, MagicMock

from bot.handlers.export import cmd_export


@pytest.mark.asyncio
async def test_cmd_export_replies():
    """cmd_export sends a reply with export instructions."""
    update = MagicMock()
    update.message.reply_text = AsyncMock()
    context = MagicMock()

    await cmd_export(update, context)

    update.message.reply_text.assert_called_once()
    text = update.message.reply_text.call_args[0][0]
    assert "export" in text.lower()
    assert "Settings" in text
    assert "Export backup" in text
