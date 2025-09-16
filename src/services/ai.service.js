
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.MODEL || "gemini-1.5-flash";

const classifyIntent = async (lead, offer) => {
  // Validate inputs
  if (!lead || !offer) {
    return { intent: "Low", explanation: "Invalid input: lead or offer data missing" };
  }

  // Fallback heuristic when no API key
  if (!GEMINI_KEY) {
    const role = (lead.role || "").toLowerCase();
    const isDecision = /head|director|vp|chief|founder|owner|manager/i.test(role);
    const industryMatch = (offer.ideal_use_cases || []).some(
      (icp) => (lead.industry || "").toLowerCase().includes(icp.toLowerCase())
    );
    if (isDecision && industryMatch) {
      return { intent: "Medium", explanation: "Heuristic: decision maker with industry match" };
    }
    if (isDecision) {
      return { intent: "Medium", explanation: "Heuristic: decision maker detected" };
    }
    return { intent: "Low", explanation: "Heuristic: insufficient signal and no AI key configured" };
  }

  const prompt = buildPrompt(lead, offer);
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert B2B lead intent classifier. Use the provided prospect and product details to classify intent.\n\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 150, // Similar to OpenAI's max_tokens
        temperature: 0.2, // Consistent with previous settings
      },
    });

    const text = result.response.text().trim();
    if (!text) {
      return { intent: "Low", explanation: "AI response empty or malformed" };
    }

    // Parse response with robust logic
    const intentMatch = text.match(/^(High|Medium|Low)\s*—\s*(.+)$/i);
    const intent = intentMatch ? intentMatch[1] : "Low";
    const explanation = intentMatch ? intentMatch[2].trim() : text || "No reasoning provided by AI";

    return { intent, explanation };
  } catch (err) {
    console.error("Gemini API error:", {
      message: err.message,
      code: err.code || "unknown",
      details: err.details || "no details",
    });

    // Specific error handling
    if (err.message.includes("API key not valid") || err.message.includes("Invalid API key")) {
      return { intent: "Low", explanation: "AI error: Invalid Gemini API key. Check GEMINI_API_KEY in .env." };
    }
    if (err.message.includes("Quota exceeded") || err.message.includes("rate limit")) {
      return { intent: "Low", explanation: "AI error: Gemini API quota or rate limit exceeded. Check Google AI Studio dashboard." };
    }
    if (err.message.includes("timeout")) {
      return { intent: "Low", explanation: "AI error: Request timeout" };
    }
    return { intent: "Low", explanation: `AI error: ${err.message}` };
  }
};

function buildPrompt(lead, offer) {
  return `Product: ${offer.name || "Unknown"}
Value props: ${offer.value_props?.join(", ") || "None provided"}
ICP: ${offer.ideal_use_cases?.join(", ") || "None provided"}

Prospect:
Name: ${lead.name || "Unknown"}
Role: ${lead.role || "Unknown"}
Company: ${lead.company || "Unknown"}
Industry: ${lead.industry || "Unknown"}
Location: ${lead.location || "Unknown"}
LinkedIn bio: ${lead.linkedin_bio || "None provided"}

Instruction: Classify the buying intent as High, Medium, or Low and provide a 1-2 sentence reason. Format: "<Intent> — <reason>"`;
}

export default { classifyIntent };