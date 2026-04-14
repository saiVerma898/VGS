import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Viral Growth Strategy",
};

export default function TermsPage() {
  return (
    <section className="pt-24 pb-20 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-8 h-[3px] bg-highlight" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Legal
          </span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-black tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-muted mb-10">Last updated: April 13, 2026</p>

        <div className="space-y-8 text-[15px] text-foreground/80 leading-[1.8]">
          <p>
            By using Viral Growth Strategy you agree to these Terms. If you
            do not agree, do not use the Service.
          </p>

          <div>
            <h2 className="text-base font-bold text-foreground mb-2">
              Subscriptions
            </h2>
            <p>
              Pro subscriptions are billed in advance on a recurring basis. Your
              subscription auto-renews unless cancelled before the next billing
              date. Cancel anytime through your account settings.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-foreground mb-2">
              Refund Policy
            </h2>
            <p>
              7-day money-back guarantee on all new Pro subscriptions. Email us
              within 7 days for a full refund. After 7 days, cancel anytime to
              prevent future charges.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-foreground mb-2">
              Content Usage
            </h2>
            <p>
              All content is for personal, non-commercial use. Do not
              redistribute or resell without permission. Brief excerpts with
              attribution are permitted.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-foreground mb-2">
              Limitation of Liability
            </h2>
            <p>
              VGS provides intelligence for informational purposes. We do not
              guarantee specific results from any strategy discussed on our
              platform.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-foreground mb-2">
              Contact
            </h2>
            <p>
              Questions? Email hello@viralgrowthstrategy.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
