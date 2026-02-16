"""TGVault Backend - FastAPI application."""

from contextlib import asynccontextmanager
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_config
from app.routes import auth, health, vault


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_config().validate()
    yield
    # shutdown


app = FastAPI(title="TGVault API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router, prefix="/api/v1")
app.include_router(vault.router, prefix="/api/v1")
