"""Dashboard statistics endpoints."""

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from api.schemas import DashboardStats
from auth.security import get_current_user
from database.db import get_db
from models.visitor import Visitor
from models.user import User

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
def get_stats(
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today_start - timedelta(days=now.weekday())
    month_start = today_start.replace(day=1)

    total = db.query(func.count(Visitor.id)).scalar() or 0
    active_today = (
        db.query(func.count(Visitor.id))
        .filter(Visitor.created_at >= today_start)
        .scalar()
        or 0
    )
    weekly = (
        db.query(func.count(Visitor.id))
        .filter(Visitor.created_at >= week_start)
        .scalar()
        or 0
    )
    monthly = (
        db.query(func.count(Visitor.id))
        .filter(Visitor.created_at >= month_start)
        .scalar()
        or 0
    )
    meetings = (
        db.query(func.count(Visitor.id))
        .filter(Visitor.purpose == "meeting")
        .scalar()
        or 0
    )
    technical = (
        db.query(func.count(Visitor.id))
        .filter(Visitor.purpose == "technical_support")
        .scalar()
        or 0
    )

    return DashboardStats(
        total_visitors=total,
        active_today=active_today,
        meetings=meetings,
        technical_requests=technical,
        weekly_visitors=weekly,
        monthly_visitors=monthly,
    )
