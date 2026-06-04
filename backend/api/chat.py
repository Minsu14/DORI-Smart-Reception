"""AI chat endpoints."""

from fastapi import APIRouter

from api.schemas import ChatRequest, ChatResponse
from services.ai_service import get_ai_response

router = APIRouter()


@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    response = get_ai_response(request.message, request.history)
    return ChatResponse(response=response)
