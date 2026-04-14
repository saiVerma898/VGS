import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Viral Growth Strategy",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-muted mb-10">Last updated: April 13, 2026</p>

        <div className="space-y-8 text-[15px] text-foreground/80 leading-[1.8]">
          <p>
            Viral Growth Strategy (&quot;VGS,&quot; &quot;we,&quot; &quot;our&quot;)
            operates viralgrowthstrategy.com. This Privacy Policy explains how we
            collect, use, and protect your personal information.
          </p>

          <div>
            <h2 className="text-base font-bold text-foreground mb-2">
              Information We Collect
            </h2>
            <p>
              We collect information you provide directly — your email when
              subscribing, and payment info when purchasing (processed securely
              by Stripe). We also collect usage data automatically to improve
              the service.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-foreground mb-2">
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-muted text-sm">
              <li>To provide and maintain our service</li>
              <li>To process subscriptions and payments</li>
              <li>To send our daily newsletter (with your consent)</li>
              <li>To improve our platform and content</li>
              <li>To communicate about your account</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-bold text-foreground mb-2">
              Your Rights
            </h2>
            <p>
              You can access, update, or delete your data at any time.
              Unsubscribe from the newsletter with one click. For data deletion,
              email hello@viralgrowthstrategy.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
