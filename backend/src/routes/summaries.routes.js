import express from "express";
import {
  CreateSummary,
  GetSummary,
} from "../controllers/summary.controller.js";

const router = express.Router();

router.post("/", CreateSummary);

router.get("/:shareId", GetSummary);

export default router;
