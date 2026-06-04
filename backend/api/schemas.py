"""Pydantic request/response schemas."""

from datetime import datetime

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class VisitorCreate(BaseModel):
    first_name: str
    last_name: str
    phone: str | None = None
    email: str | None = None
    company: str | None = None
    purpose: str
    face_image: str | None = None


class VisitorResponse(BaseModel):
    id: int
    visitor_id: str
    first_name: str
    last_name: str
    phone: str | None
    email: str | None
    company: str | None
    purpose: str
    qr_code: str | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class VisitorUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    phone: str | None = None
    email: str | None = None
    company: str | None = None
    purpose: str | None = None
    status: str | None = None


class ChatRequest(BaseModel):
    message: str
    history: list[dict] | None = None


class ChatResponse(BaseModel):
    response: str


class DashboardStats(BaseModel):
    total_visitors: int
    active_today: int
    meetings: int
    technical_requests: int
    weekly_visitors: int
    monthly_visitors: int


class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    visitor_id: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
