import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["weight_loss", "muscle_gain", "endurance", "general"], default: "general" },
  targetValue: { type: Number, default: 0 },
  unit: { type: String, default: "" },
  deadline: { type: Date },
  status: { type: String, enum: ["active", "completed", "archived"], default: "active" }
}, { timestamps: true });

export default mongoose.model("Goal", GoalSchema);
