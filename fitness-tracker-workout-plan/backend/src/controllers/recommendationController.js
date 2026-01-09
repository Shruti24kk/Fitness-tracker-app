import fetch from "node-fetch";
import User from "../models/User.js";
import Workout from "../models/Workout.js";

export async function recommend(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const recent = await Workout.find({ userId: req.user.id }).sort({ date: -1 }).limit(50);

  const payload = {
    user: {
      fitnessLevel: user.fitnessLevel,
      preferences: user.preferences
    },
    recentWorkouts: recent.map(w => ({
      date: w.date,
      type: w.type,
      durationMin: w.durationMin,
      calories: w.calories
    })),
    goal: req.body?.goal ?? null
  };

  const url = `${process.env.AI_SERVICE_URL}/recommend`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!r.ok) {
    const text = await r.text();
    return res.status(502).json({ error: "AI service error", details: text });
  }

  const data = await r.json();
  res.json(data);
}
