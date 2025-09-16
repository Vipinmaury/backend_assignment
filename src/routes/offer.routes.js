import express from "express";
import { createOffer, getOffer } from "../controllers/offer.controller.js";
const router = express.Router();

router.post("/", createOffer);
router.get("/", getOffer);

export default router;
