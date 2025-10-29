import Stripe from "stripe";
import Transaction from "../models/transaction.js";    
import User from "../models/User.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Use raw body to verify the signature
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
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

      // Find the transaction that hasn't been paid yet
      const transaction = await Transaction.findOne({ _id: transactionId, isPaid: false });
      if (!transaction) {
        console.log("Transaction already processed or not found:", transactionId);
        return res.status(200).send("Transaction not found or already processed");
      }

      // Update user credits
      await User.updateOne(
        { _id: transaction.userId },
        { $inc: { credits: transaction.credits } }
      );

      // Mark transaction as paid
      transaction.isPaid = true;
      await transaction.save();

      console.log(`User ${transaction.userId} credited with ${transaction.credits} credits`);
      return res.status(200).send("Webhook handled successfully");
    } else {
      console.log("Event type not handled:", event.type);
      return res.status(200).send("Event type ignored");
    }
  } catch (err) {
    console.error("Error handling webhook:", err);
    return res.status(500).send("Internal Server Error");
  }
};
