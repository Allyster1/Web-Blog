import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
   windowMs: 2 * 60 * 1000,
   max: 100,
   standardHeaders: true,
   legacyHeaders: false,
   message: {
      message: "Too many requests from this IP, please try again after 2 minutes",
   },
   skipFailedRequests: false,
});
