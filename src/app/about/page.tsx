import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About | Viral Growth Strategy",
  description:
    "We're a team of viral marketers and researchers helping 30,000+ marketers grow apps organically.",
};

export default function AboutPage() {
  return (
    <section className="pt-24 pb-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Hero */}
        <div className="max-w-3xl mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-8 h-[3px] bg-highlight" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              About
            </span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-8">
            We Do the Scrolling.
            <br />
            You Get the Growth.
          </h1>
          <div className="text-lg text-muted leading-relaxed space-y-4 max-w-2xl">
            <p>
              Viral Growth Strategy is the intelligence platform for organic
              social media marketing. We analyze thousands of viral campaigns
              daily across TikTok, Instagram, and YouTube — then distill
              everything into actionable case studies and growth playbooks.
            </p>
            <p>
              What started as a research newsletter has grown into a platform
              trusted by <strong className="text-foreground">30,000+ marketers</strong> — from
              indie founders to growth teams at Meta, ByteDance, and Spotify.
            </p>
          </div>
        </div>

        {/* Numbers — Bloomberg data strip style */}
        <div className="border-y-2 border-foreground mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-card-border">
            {[
              { value: "30,000+", label: "Subscribers" },
              { value: "2,000+", label: "Case Studies" },
              { value: "500M+", label: "Views Analyzed" },
              { value: "1,500+", label: "Accounts Tracked" },
            ].map((stat) => (
              <div key={stat.label} className="py-6 px-4 sm:px-6">
                <div className="text-3xl sm:text-4xl font-black tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-muted mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="font-editorial text-2xl sm:text-3xl font-black mb-8">
            What We Believe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t-2 border-foreground">
            {[
              {
                title: "Data Over Hype",
                description:
                  "Every insight is backed by real metrics. We don't deal in theory — only strategies with proven, measurable results.",
              },
              {
                title: "Always Watching",
                description:
                  "Our research team monitors thousands of accounts 24/7. We see trends before they peak.",
              },
              {
                title: "Community First",
                description:
                  "We exist to serve the growth community. Our intelligence levels the playing field for everyone.",
              },
              {
                title: "Actionable, Always",
                description:
                  "We don't publish anything you can't act on today. Every piece comes with a clear playbook.",
              },
            ].map((v, i) => (
              <div
                key={v.title}
                className={`p-6 border-b border-card-border ${
                  i % 2 === 0 ? "md:border-r" : ""
                } border-card-border`}
              >
                <h3 className="text-base font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="font-editorial text-2xl sm:text-3xl font-black mb-8">
            The Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t-2 border-foreground">
            {[
              {
                name: "Srinjay Verma",
                role: "Founder & CEO",
                bio: "Growth obsessive with a track record of scaling apps to millions of organic users. Previously led growth at multiple Y Combinator startups.",
              },
              {
                name: "Research Team",
                role: "Growth Engineers",
                bio: "A dedicated team of viral marketers and analysts who have collectively generated billions of organic views across TikTok, Instagram, and YouTube.",
              },
            ].map((member, i) => (
              <div
                key={member.name}
                className={`p-6 border-b border-card-border ${
                  i % 2 === 0 ? "md:border-r" : ""
                } border-card-border`}
              >
                <div className="w-10 h-10 bg-foreground text-white flex items-center justify-center text-sm font-bold mb-4">
                  {member.name[0]}
                </div>
                <h3 className="text-base font-bold">{member.name}</h3>
                <p className="text-sm text-highlight font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="border-2 border-foreground p-8 sm:p-12">
          <h2 className="font-editorial text-2xl sm:text-3xl font-black mb-3">
            Ready to Accelerate Your Growth?
          </h2>
          <p className="text-muted mb-6 max-w-lg">
            Join 30,000+ marketers who start every morning with VGS.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 bg-foreground text-white px-7 py-3 text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              Get Pro Access
              <ArrowRight className="h-4 w-4" />
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
    </section>
  );
}
