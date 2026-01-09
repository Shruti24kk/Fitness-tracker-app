import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

export const registerValidators = [
  body("name").isString().isLength({ min: 2 }),
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6 })
];

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, fitnessLevel, preferences } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    fitnessLevel: fitnessLevel ?? "beginner",
    preferences: preferences ?? undefined
  });

  const token = jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, fitnessLevel: user.fitnessLevel, preferences: user.preferences } });
}

export const loginValidators = [
  body("email").isEmail(),
  body("password").isString().isLength({ min: 1 })
];

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, fitnessLevel: user.fitnessLevel, preferences: user.preferences } });
}
