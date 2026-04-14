import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS, PlanKey } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  const plan = request.nextUrl.searchParams.get("plan") as PlanKey | null;

  if (!plan || !PLANS[plan]) {
    return NextResponse.redirect(new URL("/#pricing", request.url));
  }

  const selectedPlan = PLANS[plan];

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        plan: plan,
      },
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.redirect(new URL("/#pricing", request.url));
  }
}
