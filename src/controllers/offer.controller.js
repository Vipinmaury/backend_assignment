import Offer from "../models/offer.js";

// Save latest offer (for simplicity we keep single latest)
export const createOffer = async (req, res, next) => {
  try {
    const { name, value_props = [], ideal_use_cases = [] } = req.body;
    if (!name) return res.status(400).json({ error: "Offer name required" });

    // remove previous offers (optional) or just store new
    await Offer.deleteMany({});
    const offer = await Offer.create({ name, value_props, ideal_use_cases });
    res.status(201).json({ message: "Offer saved", offer });
  } catch (err) {
    next(err);
  }
};

export const getOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findOne().sort({ createdAt: -1 });
    res.json(offer || {});
  } catch (err) {
    next(err);
  }
};
