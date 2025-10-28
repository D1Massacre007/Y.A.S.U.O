import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { stripeWebhook } from "./controllers/webhooks.js";

dotenv.config();
const app = express();

// ✅ Connect to Database
connectDB();

// ✅ Stripe Webhook (use raw body only for this route)
app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhook);

// ✅ Middleware
app.use(cors());
app.use(express.json()); // normal JSON parsing for all other routes

// ✅ Test route
app.get("/", (req, res) => res.send("✅ Server is Live!"));

// ✅ API routes
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit", creditRouter);

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

