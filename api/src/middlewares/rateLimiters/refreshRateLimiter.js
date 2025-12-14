import rateLimit from "express-rate-limit";

export const refreshRateLimiter = rateLimit({
   windowMs: 60 * 1000, // 1 minute
   max: 10,
   message: {
      message: "Too many refresh attempts. Please slow down.",
   },
   standardHeaders: true,
   legacyHeaders: false,
});
