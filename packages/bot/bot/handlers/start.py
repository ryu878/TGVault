"""Start command - show welcome and Open Vault button."""

from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes

from bot.config import get_config


async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    config = get_config()
    keyboard = None
    if config.webapp_url:
        keyboard = InlineKeyboardMarkup([
            [InlineKeyboardButton("Open Vault", web_app=WebAppInfo(url=config.webapp_url))]
        ])
    await update.message.reply_text(
        "Welcome to TGVault — your zero-knowledge password manager.\n\n"
        "Your master password never leaves your device. Open the vault to get started.",
        reply_markup=keyboard,
    )
