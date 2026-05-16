import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import summaryRouter from "./routes/summaries.routes.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import dns from "node:dns";

// Using Google Public DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

if (
  !process.env.INTERNAL_API_SECRET ||
  process.env.INTERNAL_API_SECRET.length < 32
) {
  console.error(
    "FATAL: INTERNAL_API_SECRET must be set and at least 32 characters.",
  );
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());

app.use(generalLimiter);
app.use("/api/summaries", summaryRouter);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
