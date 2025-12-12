import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
   {
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
         select: false,
      },
   },
   {
      timestamps: true,
   }
);

userSchema.pre("save", async function () {
   if (!this.isModified("password")) return;
   this.password = await bcrypt.hash(this.password, 12);
});

const User = model("User", userSchema);

export default User;
