"""Visitor management endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from api.schemas import VisitorCreate, VisitorResponse, VisitorUpdate
from auth.security import get_current_user
from database.db import get_db
from models.visitor import Visitor
from models.user import User
from services.visitor_service import register_visitor

router = APIRouter()


@router.post("/register", response_model=VisitorResponse)
def create_visitor(data: VisitorCreate, db: Session = Depends(get_db)):
    visitor = register_visitor(
        db=db,
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
        email=data.email,
        company=data.company,
        purpose=data.purpose,
        face_image=data.face_image,
    )
    return visitor


@router.get("/", response_model=list[VisitorResponse])
def list_visitors(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    search: str | None = None,
    purpose: str | None = None,
    status: str | None = None,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    query = db.query(Visitor)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            (Visitor.first_name.ilike(pattern))
            | (Visitor.last_name.ilike(pattern))
            | (Visitor.visitor_id.ilike(pattern))
            | (Visitor.company.ilike(pattern))
        )

    if purpose:
        query = query.filter(Visitor.purpose == purpose)

    if status:
        query = query.filter(Visitor.status == status)

    return query.order_by(Visitor.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{visitor_id}", response_model=VisitorResponse)
def get_visitor(visitor_id: str, db: Session = Depends(get_db)):
    visitor = db.query(Visitor).filter(Visitor.visitor_id == visitor_id).first()
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")
    return visitor


@router.put("/{visitor_id}", response_model=VisitorResponse)
def update_visitor(
    visitor_id: str,
    data: VisitorUpdate,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    visitor = db.query(Visitor).filter(Visitor.visitor_id == visitor_id).first()
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(visitor, key, value)

    db.commit()
    db.refresh(visitor)
    return visitor


@router.delete("/{visitor_id}")
def delete_visitor(
    visitor_id: str,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    visitor = db.query(Visitor).filter(Visitor.visitor_id == visitor_id).first()
    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    db.delete(visitor)
    db.commit()
    return {"detail": "Visitor deleted"}
