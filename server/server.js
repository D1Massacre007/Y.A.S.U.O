import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { stripeWebhook } from "./controllers/creditController.js";

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Stripe webhook route (raw body MUST come before express.json())
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhook);

// Middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

// Test route
app.get("/", (req, res) => res.send("✅ Server is Live!"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
