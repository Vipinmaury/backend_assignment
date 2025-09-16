import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  industry: String,
  location: String,
  linkedin_bio: String,
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
