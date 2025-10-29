import Stripe from "stripe";
import Transaction from "../models/transaction.js";
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Available plans
const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 5,
    credits: 100,
    description: "Great for individuals starting out.",
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models"
    ]
  },
  {
    _id: "pro",
    name: "Pro",
    price: 10,
    credits: 500,
    description: "Perfect for power users and professionals.",
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time"
    ]
  },
  {
    _id: "premium",
    name: "Premium",
    price: 20,
    credits: 1000,
    description: "Everything you need for advanced projects and teams.",
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager"
    ]
  }
];

// GET all plans
export const getPlans = (req, res) => {
  try {
    return res.json({ success: true, plans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Purchase plan
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const plan = plans.find((p) => p._id === planId);
    if (!plan) return res.status(400).json({ success: false, message: "Invalid plan ID" });

    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    const origin = req.headers.origin || process.env.CLIENT_URL || "http://localhost:5173";

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
    console.error("Purchase Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Stripe webhook
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Webhook received:", event.type);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { transactionId, appId } = session.metadata || {};

      if (!transactionId || appId !== "YASUO") {
        console.log("Ignored event: missing transactionId or invalid appId");
        return res.status(200).send("Ignored event");
      }

      const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });
      if (!transaction) {
        console.log("Transaction already processed or not found:", transactionId);
        return res.status(200).send("Transaction not found or already processed");
      }

      // Increment user credits
      const updatedUser = await User.findByIdAndUpdate(
        transaction.userId,
        { $inc: { credits: transaction.credits } },
        { new: true }
      );

      transaction.isPaid = true;
      await transaction.save();

      console.log(`User ${transaction.userId} credited with ${transaction.credits}. Total credits: ${updatedUser.credits}`);
      return res.status(200).send("Webhook handled successfully");
    } else {
      console.log("Event type not handled:", event.type);
      return res.status(200).send("Event ignored");
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).send("Internal Server Error");
  }
};
