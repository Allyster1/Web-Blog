import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
   windowMs: 1 * 60 * 1000,
   max: 100,
   standardHeaders: true,
   legacyHeaders: false,
   message: {
      message: "Too many requests from this IP, please try again after 15 minutes",
   },
   skipFailedRequests: false,
});
