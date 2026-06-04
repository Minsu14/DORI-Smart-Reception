# DORI Smart Reception AI

AI-powered digital reception system for companies, business centers, hotels, and government institutions.

## Features

- **Welcome Screen** — Animated landing with real-time clock and date
- **Face Detection** — Browser-based camera face detection with screenshot capture
- **Visitor Registration** — Full registration form with purpose selection
- **AI Assistant** — Chat interface powered by OpenAI (with local fallback)
- **QR Code Generation** — Unique visitor ID with downloadable QR code
- **Admin Dashboard** — Statistics cards (daily/weekly/monthly visitors, meetings, technical requests)
- **Visitor Management** — Search, view, edit, and delete visitors
- **Notification System** — Real-time alerts for new registrations

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, React Query |
| Backend | FastAPI, Python 3.12, SQLAlchemy |
| Database | SQLite |
| AI | OpenAI API (GPT-4o-mini) with local fallback |
| Auth | JWT (python-jose + passlib) |
| Container | Docker + Docker Compose |

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 22+
- npm 10+

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/DORI-Smart-Reception.git
cd DORI-Smart-Reception
```

### 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env to set your OPENAI_API_KEY (optional — local fallback works without it)

# Start the server
uvicorn main:app --reload --port 8000
```

### 3. Frontend setup

```bash
cd frontend
npm install

# Configure environment
cp .env.example .env.local

# Start the dev server
npm run dev
```

### 4. Open the app

- **Reception Interface**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin/login
- **API Documentation**: http://localhost:8000/docs

### Default Admin Credentials

```
Username: admin
Password: admin123
```

## Docker Deployment

```bash
# Build and start all services
docker compose up --build -d

# Optional: set OpenAI API key
OPENAI_API_KEY=sk-your-key docker compose up --build -d
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## Project Structure

```
DORI-Smart-Reception/
├── frontend/                   # Next.js 16 app
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── page.tsx       # Welcome Screen
│   │   │   ├── face-detection/
│   │   │   ├── register/
│   │   │   ├── chat/
│   │   │   ├── qr-code/[id]/
│   │   │   └── admin/
│   │   │       ├── login/
│   │   │       ├── dashboard/
│   │   │       ├── visitors/
│   │   │       └── notifications/
│   │   ├── components/        # Shared components
│   │   └── lib/               # API client, utilities
│   ├── Dockerfile
│   └── package.json
├── backend/                    # FastAPI app
│   ├── api/                   # Route handlers
│   ├── auth/                  # JWT authentication
│   ├── database/              # SQLAlchemy setup
│   ├── models/                # ORM models
│   ├── services/              # Business logic
│   ├── main.py               # App entrypoint
│   ├── config.py             # Settings
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Admin login | No |
| POST | `/api/visitors/register` | Register visitor | No |
| GET | `/api/visitors/` | List visitors | Yes |
| GET | `/api/visitors/{id}` | Get visitor | No |
| PUT | `/api/visitors/{id}` | Update visitor | Yes |
| DELETE | `/api/visitors/{id}` | Delete visitor | Yes |
| POST | `/api/chat/` | AI chat | No |
| GET | `/api/dashboard/stats` | Dashboard stats | Yes |
| GET | `/api/notifications/` | List notifications | Yes |
| GET | `/api/notifications/unread-count` | Unread count | Yes |
| PUT | `/api/notifications/{id}/read` | Mark read | Yes |
| PUT | `/api/notifications/read-all` | Mark all read | Yes |
| GET | `/api/health` | Health check | No |

## UI Design

- **Theme**: Dark with glassmorphism
- **Colors**: `#0F172A` (background), `#1E293B` (surface), `#3B82F6` (primary)
- **Animations**: Framer Motion transitions throughout
- **Style**: Modern, corporate, responsive

## Environment Variables

### Backend (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./dori.db` | Database connection string |
| `SECRET_KEY` | — | JWT secret key |
| `OPENAI_API_KEY` | — | OpenAI API key (optional) |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model |
| `ADMIN_USERNAME` | `admin` | Default admin username |
| `ADMIN_PASSWORD` | `admin123` | Default admin password |

### Frontend (.env.local)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |

## License

MIT
