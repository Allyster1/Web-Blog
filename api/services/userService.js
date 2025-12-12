import bcrypt from "bcrypt";

import User from "../models/User.js";
import { generateAuthToken } from "../utils/tokenUtils.js";

export async function register(email, password, rePass) {
   const user = await User.findOne({ email });

   if (user) {
      throw new Error("User already exists!");
   }

   if (password !== rePass) {
      throw new Error("Password mismatch!");
   }

   const createdUser = await User.create({ email, password });

   const token = generateAuthToken(createdUser);

   return token;
}

export async function login(email, password) {
   const user = await User.findOne({ email }).select("+password");

   if (!user) {
      throw new Error("Invalid email or password");
   }

   const isValid = await bcrypt.compare(password, user.password);

   if (!isValid) {
      throw new Error("Invalid email or password");
   }

   const token = generateAuthToken(user);

   return token;
}
