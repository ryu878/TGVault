# TGVault Bot
FROM python:3.11-slim

WORKDIR /app

COPY packages/bot/pyproject.toml ./
COPY packages/bot/bot ./bot

RUN pip install --no-cache-dir -e .

CMD ["python", "-m", "bot.main"]
