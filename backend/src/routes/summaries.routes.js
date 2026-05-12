import express from "express";
import {
  GetSummary,
  generateSummary,
} from "../controllers/summary.controller.js";

const router = express.Router();

router.post("/generate", generateSummary);
router.get("/:shareId", GetSummary);

export default router;
