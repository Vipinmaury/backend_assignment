


const decisionMakerKeywords = [
  "head",
  "director",
  "vp",
  "chief",
  "founder",
  "owner",
  "manager",
  "ceo",
  "cfo"
];

const influencerKeywords = [
  "lead",
  "senior",
  "principal",
  "staff",
  "engineer",
  "architect",
  "consultant"
];

export const roleScore = (role = "") => {
  if (!role) return 0;
  const r = role.toLowerCase();
  if (decisionMakerKeywords.some(k => r.includes(k))) return 20;
  if (influencerKeywords.some(k => r.includes(k))) return 10;
  return 0;
};

export const industryScore = (industry = "", icpList = []) => {
  if (!industry) return 0;
  const ind = industry.toLowerCase();
  if (!icpList || icpList.length === 0) return 0;

  // exact match
  if (icpList.some(i => i.toLowerCase() === ind)) return 20;

  // partial / adjacent match
  if (icpList.some(i => ind.includes(i.toLowerCase()) || i.toLowerCase().includes(ind)))
    return 10;

  return 0;
};

export const completenessScore = (lead = {}) => {
  const fields = ["name", "role", "company", "industry", "location", "linkedin_bio"];
  for (const f of fields) {
    if (!lead[f] || String(lead[f]).trim() === "") return 0;
  }
  return 10;
};
