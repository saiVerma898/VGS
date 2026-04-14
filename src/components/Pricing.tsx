"use client";

import { Check } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    description: "Stay informed",
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceLabel: "$0",
    priceSuffix: "",
    cta: "Subscribe Free",
    href: "#newsletter",
    featured: false,
    features: [
      "Daily newsletter",
      "Weekly format roundup",
      "5 free case studies/month",
      "Community access",
    ],
  },
  {
    name: "Pro",
    description: "Full platform access",
    monthlyPrice: 24,
    yearlyPrice: 228,
    priceLabel: "$24",
    priceSuffix: "/mo",
    cta: "Start Pro",
    href: "/api/checkout?plan=pro_monthly",
    featured: true,
    features: [
      "Everything in Free",
      "Unlimited case studies",
      "AI-powered search",
      "Competitor intelligence",
      "Newcomer alerts",
      "Expert reports",
      "1,500+ account database",
      "Advanced analytics",
      "Personal dashboard",
      "Mobile app access",
    ],
  },
  {
    name: "Team",
    description: "For growth teams",
    monthlyPrice: 0,
    yearlyPrice: 0,
    priceLabel: "Custom",
    priceSuffix: "",
    cta: "Contact Us",
    href: "/contact",
    featured: false,
    features: [
      "Everything in Pro",
      "Multi-seat access",
      "Shared dashboards",
      "Priority support",
      "Custom tracking",
      "Quarterly sessions",
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-8 h-[3px] bg-highlight" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Pricing
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Simple, Transparent Pricing
          </h2>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-4 mb-12">
          <span
            className={`text-sm font-medium ${
              !annual ? "text-foreground" : "text-muted"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors border ${
              annual
                ? "bg-foreground border-foreground"
                : "bg-card-border border-card-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
                annual ? "translate-x-6 bg-white" : "translate-x-0 bg-white"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              annual ? "text-foreground" : "text-muted"
            }`}
          >
            Annual
            <span className="text-highlight text-xs font-bold ml-1">
              –20%
            </span>
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-foreground">
          {plans.map((plan, i) => {
            const price =
              plan.name === "Pro"
                ? annual
                  ? `$${Math.round(plan.yearlyPrice / 12)}`
                  : `$${plan.monthlyPrice}`
                : plan.priceLabel;
            const suffix = plan.name === "Pro" ? "/mo" : plan.priceSuffix;
            const billingNote =
              plan.name === "Pro" && annual
                ? `$${plan.yearlyPrice}/year`
                : plan.name === "Pro"
                ? "Billed monthly"
                : null;

            const checkoutHref =
              plan.name === "Pro"
                ? annual
                  ? "/api/checkout?plan=pro_annual"
                  : "/api/checkout?plan=pro_monthly"
                : plan.href;

            return (
              <div
                key={plan.name}
                className={`p-8 ${
                  i < 2 ? "md:border-r-2 md:border-foreground" : ""
                } ${plan.featured ? "bg-cream" : "bg-white"}`}
              >
                {plan.featured && (
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-highlight mb-4">
                    Most Popular
                  </div>
                )}

                <h3 className="font-editorial text-2xl font-black mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted mb-6">{plan.description}</p>

                <div className="mb-1">
                  <span className="text-4xl font-black tracking-tight">
                    {price}
                  </span>
                  {suffix && (
                    <span className="text-muted text-sm ml-1">{suffix}</span>
                  )}
                </div>
                {billingNote && (
                  <p className="text-xs text-muted mb-6">{billingNote}</p>
                )}
                {!billingNote && <div className="mb-6" />}

                <a
                  href={checkoutHref}
                  className={`block w-full py-3 text-center text-sm font-semibold transition-colors ${
                    plan.featured
                      ? "bg-foreground text-white hover:bg-foreground/90"
                      : "border border-foreground text-foreground hover:bg-cream"
                  }`}
                >
                  {plan.cta}
                </a>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-foreground mt-0.5 shrink-0" strokeWidth={2} />
                      <span className="text-sm text-muted">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted mt-6">
          Cancel anytime. 7-day money-back guarantee on all Pro plans.
        </p>
      </div>
    </section>
  );
}
