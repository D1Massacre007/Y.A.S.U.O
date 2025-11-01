import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // optional for OAuth users
  profilePic: { type: String, default: "" }, // stores local or OAuth profile pic
  oauthProvider: { type: String, enum: ["google", "github", "local"], default: "local" },
  credits: { type: Number, default: 20 },
}, { timestamps: true });

// Hash password before saving (only for local users)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;