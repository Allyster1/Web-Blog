import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required!"],
      trim: true,
      minLength: [2, "Full name must be at least 2 characters"],
      maxLength: [100, "Full name must not exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Invalid email address!",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minLength: [8, "The password should be at least 8 characters long"],
      validate: [
        {
          validator: (v) => /[a-z]/.test(v),
          message: "Password must contain a lowercase letter",
        },
        {
          validator: (v) => /[A-Z]/.test(v),
          message: "Password must contain an uppercase letter",
        },
        {
          validator: (v) => /\d/.test(v),
          message: "Password must contain a number",
        },
        {
          validator: (v) => /[@$!%*?&]/.test(v),
          message: "Password must contain a special character",
        },
      ],
      select: false,
    },
    refreshToken: {
      token: { type: String, select: false },
      tokenId: { type: String, select: false, index: true },
      expiresAt: { type: Date, select: false },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(
    this.password,
    parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
  );
});

const User = model("User", userSchema);

export default User;
