import bcrypt from "bcrypt";

import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  hashToken,
} from "../utils/tokenUtils.js";
import { BadRequestError, UnauthorizedError } from "../utils/AppError.js";

export async function register(fullName, email, password, rePass) {
  if (password !== rePass) throw new BadRequestError("Passwords do not match!");

  const user = await User.findOne({ email });
  if (user)
    throw new BadRequestError("If an account exists, you’ll receive an email");

  const { token, tokenId, expiresAt } = generateRefreshToken();
  const hashedToken = await hashToken(token);

  const createdUser = await User.create({
    fullName,
    email,
    password,
    refreshToken: {
      token: hashedToken,
      tokenId,
      expiresAt,
    },
  });

  const accessToken = generateAccessToken(createdUser);

  return { accessToken, refreshToken: token };
}

export async function login(email, password, rememberMe = false) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new UnauthorizedError("Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new UnauthorizedError("Invalid email or password");

  const accessToken = generateAccessToken(user);
  // If rememberMe is true, extend refresh token to 30 days, otherwise use 1 day (session-like)
  const expiryDays = rememberMe ? 30 : 1;
  const { token, tokenId, expiresAt } = generateRefreshToken(expiryDays);

  user.refreshToken = {
    token: await hashToken(token),
    tokenId,
    expiresAt,
  };
  await user.save();

  return { accessToken, refreshToken: token, expiryDays };
}

export async function logout(userId) {
  const user = await User.findById(userId);
  if (!user) return;

  user.refreshToken = null;
  await user.save();
}

export async function refreshUserToken(oldRefreshToken) {
  const { accessToken, refreshToken } = await rotateRefreshToken(
    oldRefreshToken
  );
  return { accessToken, refreshToken };
}
