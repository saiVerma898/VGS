"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-20 sm:pt-24 pb-0 bg-white">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-10 sm:pb-16">
        <div className="max-w-4xl">
          {/* Kicker */}
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block w-8 h-[3px] bg-highlight" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Intelligence Platform
            </span>
          </div>

          {/* Headline — editorial serif */}
          <h1 className="font-editorial text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-[0.95] tracking-tight mb-8">
            The Organic Growth
            <br />
            Strategies Behind
            <br />
            Every Viral App
          </h1>

          <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-xl mb-10">
            We analyze thousands of viral campaigns daily so you don&apos;t have
            to. Case studies, competitor intelligence, and actionable playbooks
            — delivered to 30,000+ marketers.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/#pricing"
              className="group inline-flex items-center gap-2 bg-foreground text-white px-7 py-3 text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              Start Reading
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/#newsletter"
              className="inline-flex items-center gap-2 border border-foreground px-7 py-3 text-sm font-semibold hover:bg-cream transition-colors"
            >
              Free Newsletter
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar — Bloomberg-style data strip */}
      <div className="border-y-2 border-foreground bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-card-border">
            {[
              { value: "500M+", label: "Views Analyzed" },
              { value: "30,000+", label: "Subscribers" },
              { value: "2,000+", label: "Case Studies" },
              { value: "1,500+", label: "Accounts Tracked" },
            ].map((stat) => (
              <div key={stat.label} className="py-5 px-4 sm:px-6">
                <div className="text-2xl sm:text-3xl font-black tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-muted mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trusted strip */}
      <div className="border-b border-card-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="text-[11px] uppercase tracking-[0.15em] text-muted">
              Read by teams at
            </span>
            {["Meta", "ByteDance", "Snap", "Spotify", "Adobe"].map((b) => (
              <span
                key={b}
                className="text-xs font-semibold text-muted/50 tracking-wide"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
