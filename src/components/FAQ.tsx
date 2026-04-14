"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What exactly is Viral Growth Strategy?",
    a: "VGS is an intelligence platform for organic social media marketing. We analyze thousands of viral campaigns daily across TikTok, Instagram, and YouTube, then distill the insights into actionable case studies, strategy breakdowns, and a searchable database.",
  },
  {
    q: "Who is this for?",
    a: "App marketers, growth leads, indie founders, and agencies who want to grow through organic social content. Our readers range from solo developers to growth teams at Meta and Spotify.",
  },
  {
    q: "What do I get with Free vs Pro?",
    a: "Free gives you daily highlights — top strategies, trending formats, and select case studies. Pro unlocks the full platform: unlimited case studies, AI search, competitor intelligence, the account database, dashboards, alerts, and mobile access.",
  },
  {
    q: "How often is new content added?",
    a: "10+ new strategy breakdowns and case studies every day. Our research team monitors hundreds of accounts and campaigns around the clock.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel with one click from your account settings. Your access continues until the end of your billing period.",
  },
  {
    q: "How is this different from scrolling TikTok myself?",
    a: "You'd need to follow thousands of accounts and spend hours daily identifying patterns. We do that systematically with a dedicated team, then deliver structured, searchable insights. Think of us as your organic growth research department.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee on all Pro subscriptions. Email us within 7 days of purchase for a full refund.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-8 h-[3px] bg-highlight" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              FAQ
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl font-black tracking-tight">
            Questions &amp; Answers
          </h2>
        </div>

        <div className="border-t-2 border-foreground">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-card-border">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="text-[15px] font-semibold pr-8 group-hover:text-muted transition-colors">
                  {faq.q}
                </span>
                {openIndex === i ? (
                  <Minus className="h-4 w-4 text-muted shrink-0" />
                ) : (
                  <Plus className="h-4 w-4 text-muted shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="pb-5">
                  <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
