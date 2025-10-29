import express from "express";
import { getPlans, purchasePlan } from "../controllers/creditController.js";
import { protect } from "../middlewares/auth.js"; // your auth middleware

const router = express.Router();

// GET all plans
router.get("/plans", getPlans);

// Purchase plan (requires auth)
router.post("/purchase", protect, purchasePlan);

export default router;
