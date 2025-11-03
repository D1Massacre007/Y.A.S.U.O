import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  // Handle OPTIONS preflight for CORS
  if (req.method === "OPTIONS") return res.sendStatus(204);

  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, token missing" });
  }

  if (token.startsWith("Bearer ")) token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallbacksecret");
    const user = await User.findById(decoded.id).select("-password"); // exclude password
    if (!user) return res.status(401).json({ success: false, message: "Not authorized, user not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    return res.status(401).json({ success: false, message: "Not authorized, token invalid" });
  }
};
