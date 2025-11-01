import express from "express";
import passport from "../configs/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "fallbacksecret", {
    expiresIn: "30d",
  });

// --- Google OAuth ---
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/" }),
    (req, res) => {
      const token = generateToken(req.user._id);
      res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/?token=${token}`);
    }
  );
}

// --- GitHub OAuth ---
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );

  router.get(
    "/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: "/" }),
    (req, res) => {
      const token = generateToken(req.user._id);
      res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/?token=${token}`);
    }
  );
}

export default router;
