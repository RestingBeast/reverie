import express from "express";
import {
  GetSummary,
  generateSummary,
  getSummaries,
  deleteSummary,
} from "../controllers/summary.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { generateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/", requireAuth, getSummaries);
router.post("/generate", requireAuth, generateLimiter, generateSummary);
router.get("/:shareId", GetSummary);
router.delete("/:shareId", requireAuth, deleteSummary);

export default router;
