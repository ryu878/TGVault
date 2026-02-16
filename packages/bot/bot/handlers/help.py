"""Help command."""

from telegram import Update
from telegram.ext import ContextTypes


async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "TGVault stores your passwords encrypted. Only you can decrypt them with your master password.\n\n"
        "Commands:\n"
        "/start — Open the vault\n"
        "/export — Export vault backup (follow in-app instructions)\n"
        "/help — Show this message"
    )
