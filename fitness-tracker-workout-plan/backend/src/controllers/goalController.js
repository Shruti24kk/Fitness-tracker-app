import { body, validationResult } from "express-validator";
import Goal from "../models/Goal.js";

export const goalCreateValidators = [
  body("title").isString().isLength({ min: 2 }),
  body("type").optional().isIn(["weight_loss","muscle_gain","endurance","general"]),
  body("targetValue").optional().isNumeric(),
  body("unit").optional().isString(),
  body("deadline").optional().isISO8601(),
  body("status").optional().isIn(["active","completed","archived"])
];

export async function listGoals(req, res) {
  const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(200);
  res.json({ goals });
}

export async function createGoal(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const g = await Goal.create({ ...req.body, userId: req.user.id });
  res.status(201).json({ goal: g });
}

export async function updateGoal(req, res) {
  const { id } = req.params;
  const g = await Goal.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true });
  if (!g) return res.status(404).json({ error: "Goal not found" });
  res.json({ goal: g });
}

export async function deleteGoal(req, res) {
  const { id } = req.params;
  const g = await Goal.findOneAndDelete({ _id: id, userId: req.user.id });
  if (!g) return res.status(404).json({ error: "Goal not found" });
  res.json({ ok: true });
}
