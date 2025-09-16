import Lead from "../models/Lead.js";
import csvService from "../services/csv.service.js";

export const uploadCsv = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "CSV file required (field 'file')" });
    const leadsArray = await csvService.parseCsvBuffer(req.file.buffer);
    // map to Lead model and insert
    const docs = leadsArray.map(r => ({
      name: r.name || "",
      role: r.role || "",
      company: r.company || "",
      industry: r.industry || "",
      location: r.location || "",
      linkedin_bio: r.linkedin_bio || ""
    }));
    await Lead.deleteMany({}); // clear previous for test convenience
    await Lead.insertMany(docs);
    res.json({ message: "Leads uploaded", count: docs.length });
  } catch (err) {
    next(err);
  }
};

export const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().lean();
    res.json(leads);
  } catch (err) {
    next(err);
  }
};
