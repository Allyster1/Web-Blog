import { verifyAccessToken, rotateRefreshToken, attachTokensToResponse } from "../utils/tokenUtils.js";

export async function authMiddleware(req, res, next) {
   const authHeader = req.headers.authorization;
   const refreshToken = req.headers["x-refresh-token"];

   if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

   const token = authHeader.split(" ")[1];

   try {
      // Try verifying access token
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
   } catch (err) {
      // If access token expired and refresh token provided, rotate
      if (err.name === "TokenExpiredError" && refreshToken) {
         try {
            const { user, accessToken, refreshToken: newRefreshToken } = await rotateRefreshToken(refreshToken);

            // attach new tokens to response headers
            attachTokensToResponse(res, accessToken, newRefreshToken);

            req.user = { id: user._id, email: user.email };
            next();
         } catch (error) {
            return res.status(403).json({ message: "Invalid refresh token" });
         }
      } else {
         return res.status(401).json({ message: "Invalid token" });
      }
   }
}
