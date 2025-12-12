import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
   windowMs: 2 * 60 * 1000, // 15 minutes
   max: 5,
   message: {
      message: "Too many attempts, please try again after 2 minutes",
   },
   standardHeaders: true,
   legacyHeaders: false,
   skipFailedRequests: false,
});
