"""TGVault Telegram Bot - entry point."""

import asyncio
from dotenv import load_dotenv

load_dotenv()

from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

from bot.config import get_config
from bot.handlers.start import cmd_start
from bot.handlers.help import cmd_help
from bot.handlers.export import cmd_export


def main():
    config = get_config()
    app = Application.builder().token(config.bot_token).build()
    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("help", cmd_help))
    app.add_handler(CommandHandler("export", cmd_export))
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
