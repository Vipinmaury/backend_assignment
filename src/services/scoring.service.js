import aiService from "./ai.service.js";

import { roleScore, industryScore, completenessScore } from "../utils/role-utils.js";

/**
 * For each lead:
 *  - rule score (0..50)
 *  - AI points (High=50, Medium=30, Low=10)
 *  - final = rule + ai
 */
const scoreLeads = async (leads = [], offer) => {
  const out = [];
  for (const lead of leads) {
    const ruleScore = (roleScore(lead.role) + industryScore(lead.industry, offer.ideal_use_cases || []) + completenessScore(lead)) || 0;
    // AI layer
    const aiResp = await aiService.classifyIntent(lead, offer);
    const aiPoints = mapIntentToPoints(aiResp.intent);
    const finalScore = ruleScore + aiPoints;
    out.push({
      name: lead.name,
      role: lead.role,
      company: lead.company,
      industry: lead.industry,
      location: lead.location,
      intent: aiResp.intent,
      score: finalScore,
      reasoning: aiResp.explanation || `Rule:${ruleScore} + AI:${aiPoints}`
    });
  }
  return out;
};

function mapIntentToPoints(intent) {
  if (!intent) return 10;
  if (/High/i.test(intent)) return 50;
  if (/Medium/i.test(intent)) return 30;
  return 10;
}

export default { scoreLeads };
