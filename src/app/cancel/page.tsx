import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Checkout Cancelled | Viral Growth Strategy",
};

export default function CancelPage() {
  return (
    <section className="pt-24 pb-20 bg-white">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pt-8 text-center">
        <div className="w-14 h-14 border-2 border-foreground flex items-center justify-center mx-auto mb-6">
          <X className="h-7 w-7" strokeWidth={2} />
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl font-black tracking-tight mb-4">
          Checkout Cancelled
        </h1>

        <p className="text-lg text-muted mb-8 max-w-md mx-auto">
          No worries — you weren&apos;t charged. Come back anytime.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-2 bg-foreground text-white px-7 py-3 text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            View Plans
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-foreground px-7 py-3 text-sm font-semibold hover:bg-cream transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted">
          Questions?{" "}
          <Link href="/contact" className="font-semibold text-foreground hover:text-muted transition-colors">
            Contact us
          </Link>
        </p>
      </div>
    </section>
  );
}
