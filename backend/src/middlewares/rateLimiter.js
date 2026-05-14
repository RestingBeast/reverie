import rateLimit from "express-rate-limit";

// General limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

// Strict limiter
// Prevents users from hammering AI API
export const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 generations per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Generation limit reached. Please wait 1 hour before generating again.",
  },
});
