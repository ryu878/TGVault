# TGVault Makefile

.PHONY: install build dev docker-up docker-down lint test

# Install all dependencies
install:
	pnpm install
	cd packages/backend && pip install -e ".[dev]"
	cd packages/bot && pip install -e ".[dev]"

# Build all packages
build:
	pnpm run build
	cd packages/backend && pip install -e .

# Development
dev: install
	@echo "Run in separate terminals:"
	@echo "  pnpm dev:webapp   # WebApp at http://localhost:5173"
	@echo "  pnpm dev:backend  # Backend at http://localhost:8000"
	@echo "  pnpm dev:bot      # Telegram bot"
	@echo "  docker compose -f infra/docker-compose.dev.yml up -d  # Postgres"

# Docker
docker-up:
	docker compose -f infra/docker-compose.yml up -d --build

docker-down:
	docker compose -f infra/docker-compose.yml down

# Lint
lint:
	cd packages/webapp && pnpm run lint

# Test
test:
	cd packages/backend && pytest -v && cd ../bot && pytest -v
