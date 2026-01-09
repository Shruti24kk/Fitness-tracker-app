import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import workoutRoutes from "./routes/workouts.js";
import goalRoutes from "./routes/goals.js";
import progressRoutes from "./routes/progress.js";
import recommendationRoutes from "./routes/recommendations.js";
import { notFound, errorHandler } from "./middleware/errors.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Missing MONGO_URI");
  process.exit(1);
}

mongoose.connect(MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Backend listening on :${PORT}`));
}).catch((err) => {
  console.error("Mongo connection error:", err);
  process.exit(1);
});
