import express from "express";
import { runScoring, getResults, exportCsv } from "../controllers/score.controller.js";
const router = express.Router();

router.post("/", runScoring);
router.get("/results", getResults);
router.get("/export", exportCsv);

export default router;
