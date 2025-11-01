import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import { stripeWebhook } from "./controllers/creditController.js";
import passport from "passport";

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Stripe webhook (raw body first)
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhook);

// Middlewares
app.use(cors());
app.use(express.json());

// Passport (serverless-friendly: no sessions)
app.use(passport.initialize());

// API routes
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);
app.use("/api/auth", oauthRoutes);

// Test route
app.get("/", (req, res) => res.send("✅ Server is Live!"));

// Start server (local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));