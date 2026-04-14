import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return _stripe;
}

export const PLANS = {
  pro_monthly: {
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "",
    name: "Pro Monthly",
    amount: 2400,
    interval: "month" as const,
  },
  pro_annual: {
    priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID ?? "",
    name: "Pro Annual",
    amount: 22800,
    interval: "year" as const,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
