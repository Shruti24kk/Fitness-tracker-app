import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  date: { type: Date, required: true, index: true },
  type: { type: String, required: true }, // cardio, strength, yoga, etc.
  durationMin: { type: Number, required: true, min: 1 },
  calories: { type: Number, default: 0, min: 0 },
  notes: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Workout", WorkoutSchema);
