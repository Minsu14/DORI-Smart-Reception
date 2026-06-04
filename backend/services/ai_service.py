"""AI chat service using OpenAI or local fallback."""

from openai import OpenAI

from config import settings

DORI_KNOWLEDGE = """
DORI is a technology company providing the following services and products:

DORI Services:
- Software Development
- AI Solutions
- Smart Kiosk Systems
- Self-Service Solutions
- Biometric Systems
- Access Control
- NFC Solutions
- Smart Reception
- Digital Transformation

DORI Products:
- DORI Smart Reception: AI-powered digital reception system for visitor management
- DORI Access Control: Zero Touch entry technology for secure access
- Smart Doppelgänger: Advanced biometric identification system
- NFC Internet: Contactless internet access solution
- AI Warehouse Management: Intelligent warehouse automation system

Company Focus: DORI specializes in digital transformation, providing cutting-edge
AI, biometric, and smart solutions for businesses, hotels, government institutions,
and business centers.
"""

SYSTEM_PROMPT = f"""You are DORI AI Assistant — the intelligent receptionist for DORI Smart Reception.
You help visitors with information about DORI's services, products, and general inquiries.
Be professional, helpful, and concise. Respond in the same language as the user's message.

{DORI_KNOWLEDGE}

If asked about something outside DORI's scope, politely redirect to DORI-related topics
or provide general helpful information.
"""


def get_ai_response(message: str, history: list[dict] | None = None) -> str:
    if not settings.OPENAI_API_KEY:
        return _local_fallback(message)

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if history:
            messages.extend(history[-10:])

        messages.append({"role": "user", "content": message})

        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            max_tokens=500,
            temperature=0.7,
        )
        return response.choices[0].message.content or "I'm sorry, I couldn't generate a response."
    except Exception:
        return _local_fallback(message)


def _local_fallback(message: str) -> str:
    msg = message.lower()

    responses = {
        "dori": (
            "DORI is a technology company specializing in AI solutions, smart kiosk systems, "
            "biometric technologies, and digital transformation. Our products include "
            "DORI Smart Reception, DORI Access Control, Smart Doppelgänger, NFC Internet, "
            "and AI Warehouse Management."
        ),
        "access control": (
            "DORI Access Control provides Zero Touch entry technology for secure, "
            "contactless access management in buildings and facilities."
        ),
        "reception": (
            "DORI Smart Reception is an AI-powered digital reception system that "
            "greets visitors, handles registration, answers questions, and manages "
            "visitor data automatically."
        ),
        "kiosk": (
            "DORI offers Smart Kiosk Systems for self-service solutions in various "
            "industries including retail, hospitality, and government services."
        ),
        "biometric": (
            "DORI provides advanced Biometric Systems including facial recognition "
            "and the Smart Doppelgänger identification platform."
        ),
        "nfc": (
            "NFC Internet by DORI provides contactless internet access solutions "
            "using NFC technology for seamless connectivity."
        ),
        "warehouse": (
            "DORI AI Warehouse Management is an intelligent automation system "
            "for warehouse operations, inventory tracking, and logistics optimization."
        ),
    }

    for keyword, response in responses.items():
        if keyword in msg:
            return response

    return (
        "Welcome to DORI! I can help you with information about our services and products. "
        "DORI offers Software Development, AI Solutions, Smart Kiosk Systems, Biometric Systems, "
        "Access Control, NFC Solutions, Smart Reception, and Digital Transformation services. "
        "How can I assist you today?"
    )
