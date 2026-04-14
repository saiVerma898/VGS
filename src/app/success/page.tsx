import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Welcome to Pro | Viral Growth Strategy",
};

export default function SuccessPage() {
  return (
    <section className="pt-24 pb-20 bg-white">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-8 text-center">
        <div className="w-14 h-14 bg-foreground text-white flex items-center justify-center mx-auto mb-6">
          <Check className="h-7 w-7" strokeWidth={3} />
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl font-black tracking-tight mb-4">
          Welcome to VGS Pro
        </h1>

        <p className="text-lg text-muted mb-10 max-w-md mx-auto">
          Your subscription is active. Full platform access is now unlocked.
        </p>

        <div className="border-2 border-foreground p-6 sm:p-8 text-left mb-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.15em] mb-4">
            What to Do Next
          </h2>
          <ul className="space-y-3">
            {[
              "Check your email for login instructions",
              "Explore the case study library — 2,000+ strategies",
              "Set up your personalized dashboard",
              "Enable real-time alerts for your niche",
              "Download the mobile app",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="h-4 w-4 mt-0.5 shrink-0" strokeWidth={2} />
                <span className="text-sm text-muted">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 bg-foreground text-white px-7 py-3 text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            Browse Case Studies
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-foreground px-7 py-3 text-sm font-semibold hover:bg-cream transition-colors"
          >
            Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
