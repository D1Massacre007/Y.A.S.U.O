import express from "express";
import { getPlans, purchasePlan } from "../controllers/creditController.js";
import { protect } from "../middlewares/auth.js";

const creditRouter = express.Router();

// ✅ Only GET for /plans
creditRouter.get("/plans", getPlans);

// ✅ Purchase requires auth
creditRouter.post("/purchase", protect, purchasePlan);

export default creditRouter;
