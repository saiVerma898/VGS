import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle relevant events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout completed:", {
        customer: session.customer,
        email: session.customer_email ?? session.customer_details?.email,
        plan: session.metadata?.plan,
        subscription: session.subscription,
      });
      // TODO: Provision user access in your database
      // - Create/update user record
      // - Set subscription status to active
      // - Grant Pro access
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Subscription updated:", {
        id: subscription.id,
        status: subscription.status,
      });
      // TODO: Update user subscription status in your database
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("Subscription cancelled:", {
        id: subscription.id,
      });
      // TODO: Revoke Pro access in your database
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("Payment failed:", {
        customer: invoice.customer,
        subscription: invoice.parent?.subscription_details?.subscription ?? null,
      });
      // TODO: Handle failed payment (send email, flag account, etc.)
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
