import express from "express";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./config/db.js";
import summaryRouter from "./routes/summaries.routes.js";
import { generalLimiter } from "./middlewares/rateLimiter.js";
import dns from "node:dns";

// Using Google Public DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("FATAL:JWT_SECRET must be set and at least 32 characters.");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

connectDB();
app.set("trust proxy", 1);
app.use(helmet());

const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL && process.env.NODE_ENV === "production") {
  console.error("FATAL: FRONTEND_URL must be set in production.");
  process.exit(1);
}

const ALLOWED_ORIGINS = [process.env.FRONTEND_URL].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ["GET", "POST"],
  }),
);
app.use(express.json());

app.use(generalLimiter);
app.use("/api/summaries", summaryRouter);

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
