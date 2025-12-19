import {
  verifyAccessToken,
  rotateRefreshToken,
  attachTokensToResponse,
} from "../utils/tokenUtils.js";
import { UnauthorizedError } from "../utils/AppError.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const refreshToken = req.cookies?.refreshToken;

  if (!authHeader)
    return next(new UnauthorizedError("No authorization header"));

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        const {
          user,
          accessToken,
          refreshToken: newRefreshToken,
        } = await rotateRefreshToken(refreshToken);

        attachTokensToResponse(res, accessToken, newRefreshToken);

        req.user = {
          id: user._id,
          email: user.email,
          role: user.role || "user",
        };
        next();
      } catch (error) {
        return next(new UnauthorizedError("Invalid refresh token"));
      }
    } else {
      return next(new UnauthorizedError("Invalid token"));
    }
  }
}
