import Workout from "../models/Workout.js";

export async function summary(req, res) {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const workouts = await Workout.find({ userId: req.user.id, date: { $gte: since } }).sort({ date: 1 });
  const totalDuration = workouts.reduce((a, w) => a + (w.durationMin || 0), 0);
  const totalCalories = workouts.reduce((a, w) => a + (w.calories || 0), 0);

  // group by week
  const byWeek = {};
  for (const w of workouts) {
    const d = new Date(w.date);
    const weekKey = `${d.getUTCFullYear()}-W${Math.ceil((((d - new Date(Date.UTC(d.getUTCFullYear(),0,1))) / 86400000) + new Date(Date.UTC(d.getUTCFullYear(),0,1)).getUTCDay()+1)/7)}`;
    byWeek[weekKey] = byWeek[weekKey] || { durationMin: 0, calories: 0, count: 0 };
    byWeek[weekKey].durationMin += w.durationMin || 0;
    byWeek[weekKey].calories += w.calories || 0;
    byWeek[weekKey].count += 1;
  }

  res.json({
    windowDays: 30,
    totals: { workouts: workouts.length, durationMin: totalDuration, calories: totalCalories },
    byWeek
  });
}
