"""Visitor business logic."""

import io
import base64
from datetime import datetime, timezone

import qrcode
from sqlalchemy.orm import Session

from models.visitor import Visitor
from models.notification import Notification


def generate_visitor_id(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    last = (
        db.query(Visitor)
        .filter(Visitor.visitor_id.like(f"DORI-{year}-%"))
        .order_by(Visitor.id.desc())
        .first()
    )
    if last:
        seq = int(last.visitor_id.split("-")[-1]) + 1
    else:
        seq = 1
    return f"DORI-{year}-{seq:05d}"


def generate_qr_code(data: str) -> str:
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#3B82F6", back_color="#0F172A")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode()


def register_visitor(
    db: Session,
    first_name: str,
    last_name: str,
    phone: str | None,
    email: str | None,
    company: str | None,
    purpose: str,
    face_image: str | None = None,
) -> Visitor:
    visitor_id = generate_visitor_id(db)
    qr_data = f"DORI-VISITOR:{visitor_id}|{first_name} {last_name}|{purpose}"
    qr_base64 = generate_qr_code(qr_data)

    visitor = Visitor(
        visitor_id=visitor_id,
        first_name=first_name,
        last_name=last_name,
        phone=phone,
        email=email,
        company=company,
        purpose=purpose,
        face_image=face_image,
        qr_code=qr_base64,
    )
    db.add(visitor)

    notification = Notification(
        title="New Visitor Registered",
        message=f"{first_name} {last_name} has registered. Purpose: {purpose}",
        type="visitor_registered",
        visitor_id=visitor_id,
    )
    db.add(notification)

    db.commit()
    db.refresh(visitor)
    return visitor
