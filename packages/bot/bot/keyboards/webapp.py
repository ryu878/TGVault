"""WebApp keyboard helper."""

from telegram import WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup


def webapp_keyboard(url: str, text: str = "Open Vault") -> InlineKeyboardMarkup:
    """Create keyboard with WebApp button."""
    return InlineKeyboardMarkup([
        [InlineKeyboardButton(text, web_app=WebAppInfo(url=url))]
    ])
