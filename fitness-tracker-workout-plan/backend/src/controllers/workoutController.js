import { body, validationResult } from "express-validator";
import Workout from "../models/Workout.js";

export const workoutCreateValidators = [
  body("date").isISO8601(),
  body("type").isString().isLength({ min: 2 }),
  body("durationMin").isInt({ min: 1 }),
  body("calories").optional().isInt({ min: 0 }),
  body("notes").optional().isString()
];

export async function listWorkouts(req, res) {
  const workouts = await Workout.find({ userId: req.user.id }).sort({ date: -1 }).limit(200);
  res.json({ workouts });
}

export async function createWorkout(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const w = await Workout.create({ ...req.body, userId: req.user.id });
  res.status(201).json({ workout: w });
}

export async function updateWorkout(req, res) {
  const { id } = req.params;
  const w = await Workout.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true });
  if (!w) return res.status(404).json({ error: "Workout not found" });
  res.json({ workout: w });
}

export async function deleteWorkout(req, res) {
  const { id } = req.params;
  const w = await Workout.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!w) return res.status(404).json({ error: "Workout not found" });
  res.json({ ok: true });
}
