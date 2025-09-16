import express from "express";
import multer from "multer";
import { uploadCsv, getLeads } from "../controllers/leads.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/upload", upload.single("file"), uploadCsv);
router.get("/all", getLeads);

export default router;
