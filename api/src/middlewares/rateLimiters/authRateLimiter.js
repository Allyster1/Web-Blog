import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
   windowMs: 10 * 60 * 1000, // 10 minutes
   max: 10,
   message: {
      message: "Too many attempts, please try again after 10 minutes",
   },
   standardHeaders: true,
   legacyHeaders: false,
   skipFailedRequests: false,
});
