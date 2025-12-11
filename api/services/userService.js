import bcrypt from "bcrypt";

import User from "../models/User.js";
import { generateAuthToken } from "../utils/tokenUtils.js";

export async function register(email, password, rePass) {
   const user = await User.findOne({ email });

   if (user) {
      throw new Error("Email already exists");
   }

   if (password !== rePass) {
      throw new Error("Password missmatch");
   }

   const createdUser = await User.create({ email, password });

   const token = generateAuthToken(createdUser);

   return token;
}

export async function login(email, password) {
   // include the password field (it's `select: false` in the schema)
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
