import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  industry: String,
  location: String,
  intent: String,
  score: Number,
  reasoning: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Result || mongoose.model("Result", ResultSchema);
