"""Export command - direct user to export from WebApp."""

from telegram import Update
from telegram.ext import ContextTypes


async def cmd_export(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "To export your vault:\n"
        "1. Open the vault (/start → Open Vault)\n"
        "2. Go to Settings\n"
        "3. Use the Export option to download an encrypted backup.\n\n"
        "Keep your backup and master password safe!"
    )
