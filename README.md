# Fitness-tracker-app
# Fitness Tracker & Workout Plan 

A full-stack web app for logging workouts, setting goals, tracking progress, and getting AI-powered workout recommendations.

**Tech stack**
- Frontend: React (Vite)
- Backend: Node.js + Express + MongoDB (Mongoose)
- AI Service: Python FastAPI (simple recommendation engine)
- Dev orchestration: Docker Compose (optional)

## Quick start (Docker)
1. Install Docker Desktop
2. From the project root:
   ```bash
   docker compose up --build
   ```
3. Open:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000
   - AI service: http://localhost:8000/docs

## Quick start (Local, without Docker)
### 1) MongoDB
Run MongoDB locally (or use MongoDB Atlas).

### 2) Backend
```bash
cd backend
cp .env.example .env
npm i
npm run dev
```

### 3) AI Service
```bash
cd ai_service
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### 4) Frontend
```bash
cd frontend
npm i
npm run dev
```

## Environment variables
- Backend: `backend/.env`
- Frontend: `frontend/.env`

## API overview
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Workouts: `GET/POST /api/workouts`, `GET/PUT/DELETE /api/workouts/:id`
- Goals: `GET/POST /api/goals`, `PUT /api/goals/:id`, `DELETE /api/goals/:id`
- Progress: `GET /api/progress/summary`
- Recommendations: `POST /api/recommendations` (calls the Python AI service)

## Notes
This is a complete runnable scaffold intended for coursework/demo. Integrations with Google Fit / Apple Health / Strava are represented as stubs (see backend `integrations/`).

