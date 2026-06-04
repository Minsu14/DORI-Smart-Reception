"""Visitor database model."""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime, Text

from database.db import Base


class Visitor(Base):
    __tablename__ = "visitors"

    id = Column(Integer, primary_key=True, index=True)
    visitor_id = Column(String(20), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=True)
    email = Column(String(150), nullable=True)
    company = Column(String(200), nullable=True)
    purpose = Column(String(50), nullable=False)
    face_image = Column(Text, nullable=True)
    qr_code = Column(Text, nullable=True)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
