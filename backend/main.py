"""DORI Smart Reception AI - FastAPI Backend."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import create_tables
from api.visitors import router as visitors_router
from api.auth import router as auth_router
from api.chat import router as chat_router
from api.dashboard import router as dashboard_router
from api.notifications import router as notifications_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(
    title="DORI Smart Reception AI",
    version="1.0.0",
    description="AI-powered digital reception system",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(visitors_router, prefix="/api/visitors", tags=["Visitors"])
app.include_router(chat_router, prefix="/api/chat", tags=["AI Chat"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(notifications_router, prefix="/api/notifications", tags=["Notifications"])


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "DORI Smart Reception AI"}
