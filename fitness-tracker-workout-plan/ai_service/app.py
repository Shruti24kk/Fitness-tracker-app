from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

app = FastAPI(title="FTWP AI Service", version="1.0.0")

class Preferences(BaseModel):
    types: List[str] = Field(default_factory=lambda: ["strength", "cardio"])
    minutesPerSession: int = 30

class User(BaseModel):
    fitnessLevel: str = "beginner"
    preferences: Preferences = Preferences()

class Workout(BaseModel):
    date: datetime
    type: str
    durationMin: int
    calories: int = 0

class RecommendRequest(BaseModel):
    user: User
    recentWorkouts: List[Workout] = Field(default_factory=list)
    goal: Optional[Dict[str, Any]] = None

class RecommendResponse(BaseModel):
    plan: List[Dict[str, Any]]
    rationale: List[str]

def _intensity(level: str) -> str:
    return {"beginner": "low", "intermediate": "moderate", "advanced": "high"}.get(level, "low")

@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    # Basic heuristic engine (replaceable with ML later).
    pref_types = [t.lower() for t in (req.user.preferences.types or [])]
    mins = max(10, int(req.user.preferences.minutesPerSession or 30))
    intensity = _intensity(req.user.fitnessLevel)

    recent_types = [w.type.lower() for w in req.recentWorkouts[:10]]
    did_strength = any("strength" in t or "lift" in t for t in recent_types)
    did_cardio = any("cardio" in t or "run" in t or "cycle" in t for t in recent_types)
    did_yoga = any("yoga" in t or "mobility" in t for t in recent_types)

    # 3-day mini plan
    plan = []
    rationale = []

    # Day 1
    if "strength" in pref_types and not did_strength:
        plan.append({
            "day": 1,
            "title": "Full-body strength",
            "durationMin": mins,
            "intensity": intensity,
            "exercises": [
                {"name": "Bodyweight squats", "sets": 3, "reps": 10},
                {"name": "Push-ups (or incline)", "sets": 3, "reps": 8},
                {"name": "Dumbbell row (or band row)", "sets": 3, "reps": 10},
                {"name": "Plank", "sets": 3, "seconds": 30},
            ],
        })
        rationale.append("You haven't done strength recently, so we prioritize a full-body session.")
    else:
        plan.append({
            "day": 1,
            "title": "Cardio intervals",
            "durationMin": mins,
            "intensity": intensity,
            "exercises": [
                {"name": "Warm-up walk/jog", "minutes": 5},
                {"name": "Intervals (1 min hard / 2 min easy)", "rounds": max(4, mins // 6)},
                {"name": "Cool-down", "minutes": 5},
            ],
        })
        rationale.append("A cardio session balances your recent activity mix.")

    # Day 2
    if "yoga" in pref_types or not did_yoga:
        plan.append({
            "day": 2,
            "title": "Mobility + core",
            "durationMin": mins,
            "intensity": "low",
            "exercises": [
                {"name": "Cat-cow", "minutes": 3},
                {"name": "Hip opener flow", "minutes": 6},
                {"name": "Dead bug", "sets": 3, "reps": 10},
                {"name": "Side plank", "sets": 2, "seconds": 25},
            ],
        })
        rationale.append("Mobility helps recovery and supports consistency.")
    else:
        plan.append({
            "day": 2,
            "title": "Easy cardio + stretch",
            "durationMin": mins,
            "intensity": "low",
            "exercises": [
                {"name": "Easy walk/cycle", "minutes": max(15, mins - 10)},
                {"name": "Stretching", "minutes": 10},
            ],
        })
        rationale.append("A light day improves recovery while keeping your streak alive.")

    # Day 3 depends on goal
    goal_type = (req.goal or {}).get("type", "general")
    if goal_type == "muscle_gain":
        plan.append({
            "day": 3,
            "title": "Upper/lower split (hypertrophy)",
            "durationMin": mins,
            "intensity": intensity,
            "exercises": [
                {"name": "Goblet squat", "sets": 4, "reps": 8},
                {"name": "Dumbbell bench (or push-ups)", "sets": 4, "reps": 8},
                {"name": "Romanian deadlift (light)", "sets": 3, "reps": 10},
                {"name": "Lat pulldown (or band pulldown)", "sets": 3, "reps": 10},
            ],
        })
        rationale.append("Your goal is muscle gain, so we add a hypertrophy-focused session.")
    elif goal_type == "weight_loss":
        plan.append({
            "day": 3,
            "title": "Mixed cardio + strength circuit",
            "durationMin": mins,
            "intensity": "moderate" if intensity != "high" else "high",
            "exercises": [
                {"name": "Circuit (squat, push, row, carry)", "rounds": max(3, mins // 8)},
                {"name": "Steady cardio", "minutes": 10},
            ],
        })
        rationale.append("For weight loss, a circuit boosts energy expenditure and keeps training varied.")
    elif goal_type == "endurance":
        plan.append({
            "day": 3,
            "title": "Steady-state endurance",
            "durationMin": mins,
            "intensity": "moderate",
            "exercises": [
                {"name": "Continuous cardio (run/cycle/row)", "minutes": mins},
            ],
        })
        rationale.append("For endurance, we emphasize steady aerobic volume.")
    else:
        plan.append({
            "day": 3,
            "title": "Your choice day",
            "durationMin": mins,
            "intensity": intensity,
            "exercises": [
                {"name": "Pick 1: strength OR cardio", "minutes": mins},
                {"name": "5-min cooldown", "minutes": 5},
            ],
        })
        rationale.append("A flexible day helps you stay consistent with what you enjoy.")

    return RecommendResponse(plan=plan, rationale=rationale)
