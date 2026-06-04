"""Admin user model."""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime

from database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="admin")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
