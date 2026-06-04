"""Notification model."""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text

from database.db import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="visitor_registered")
    is_read = Column(Boolean, default=False)
    visitor_id = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
