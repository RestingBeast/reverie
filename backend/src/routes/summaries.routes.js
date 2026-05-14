import express from "express";
import {
  GetSummary,
  generateSummary,
} from "../controllers/summary.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { generateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/generate", requireAuth, generateLimiter, generateSummary);
router.get("/:shareId", GetSummary);

export default router;
