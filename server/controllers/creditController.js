import Transaction from "../models/transaction.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 5,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models",
    ],
  },
  {
    _id: "pro",
    name: "Pro",
    price: 10,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time",
    ],
  },
  {
    _id: "premium",
    name: "Premium",
    price: 20,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager",
    ],
  },
];

// ✅ Get all available plans
export const getPlans = (req, res) => {
  try {
    return res.json({ success: true, plans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Handle plan purchase via Stripe
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user?._id;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const plan = plans.find((p) => p._id === planId);
    if (!plan)
      return res.status(400).json({ success: false, message: "Invalid plan ID" });

    // Create new transaction
    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    const origin = req.headers.origin || process.env.CLIENT_URL || "http://localhost:5173";

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            unit_amount: plan.price * 100,
            product_data: { name: plan.name },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/loading`,
      cancel_url: `${origin}`,
      metadata: {
        transactionId: transaction._id.toString(),
        appId: "YASUO",
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("❌ Purchase Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
