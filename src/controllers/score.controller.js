import Lead from "../models/Lead.js";
import Result from "../models/Result.js";
import Offer from "../models/offer.js";
import scoringService from "../services/scoring.service.js";
import csvService from "../services/csv.service.js";

export const runScoring = async (req, res, next) => {
  try {
    const offer = await Offer.findOne().sort({createdAt:-1});
    if (!offer) return res.status(400).json({ error: "No offer saved. POST /api/offer first." });

    const leads = await Lead.find().lean();
    if (!leads || leads.length === 0) return res.status(400).json({ error: "No leads found. POST /api/leads/upload first." });

    // compute
    const results = await scoringService.scoreLeads(leads, offer);

    // store results: clear previous and insert
    await Result.deleteMany({});
    await Result.insertMany(results.map(r => ({ ...r })));

    res.json({ message: "Scoring completed", count: results.length });
  } catch (err) {
    next(err);
  }
};

export const getResults = async (req, res, next) => {
  try {
    const results = await Result.find().lean();
    res.json(results);
  } catch (err) {
    next(err);
  }
};

export const exportCsv = async (req, res, next) => {
  try {
    const results = await Result.find().lean();
    const buffer = await csvService.resultsToCsvBuffer(results);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=results.csv");
    res.send(buffer);
  } catch (err) {
    next(err);
  }
};
