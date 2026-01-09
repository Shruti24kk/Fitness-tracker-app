import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  fitnessLevel: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  preferences: {
    types: { type: [String], default: ["strength", "cardio"] },
    minutesPerSession: { type: Number, default: 30 }
  }
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
