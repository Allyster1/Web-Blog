import bcrypt from "bcrypt";

import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken, rotateRefreshToken } from "../utils/tokenUtils.js";

export async function register(email, password, rePass) {
   if (password !== rePass) throw new Error("Password mismatch!");

   const user = await User.findOne({ email });
   if (user) throw new Error("User already exists!");

   const createdUser = await User.create({ email, password });

   const accessToken = generateAccessToken(createdUser);
   const refreshToken = generateRefreshToken();

   createdUser.refreshToken = refreshToken;
   await createdUser.save();

   return { accessToken, refreshToken };
}

export async function login(email, password) {
   const user = await User.findOne({ email }).select("+password");
   if (!user) throw new Error("Invalid email or password");

   const isValid = await bcrypt.compare(password, user.password);
   if (!isValid) throw new Error("Invalid email or password");

   const accessToken = generateAccessToken(user);
   const refreshToken = generateRefreshToken();

   user.refreshToken = refreshToken;
   await user.save();

   return { accessToken, refreshToken };
}

export async function logout(userId) {
   const user = await User.findById(userId);
   if (!user) throw new Error("User not found");

   user.refreshToken = null;
   await user.save();
}

export async function refreshUserToken(oldRefreshToken) {
   const { accessToken, refreshToken } = await rotateRefreshToken(oldRefreshToken);
   return { accessToken, refreshToken };
}
