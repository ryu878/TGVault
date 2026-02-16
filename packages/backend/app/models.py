"""SQLAlchemy models."""

from datetime import datetime
from sqlalchemy import BigInteger, DateTime, Integer, LargeBinary, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Vault(Base):
    """Encrypted vault blob per Telegram user."""

    __tablename__ = "vaults"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    telegram_user_id: Mapped[int] = mapped_column(BigInteger, unique=True, nullable=False, index=True)
    ciphertext: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
