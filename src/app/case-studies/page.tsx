import { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getAllCaseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies | Viral Growth Strategy",
  description:
    "Deep-dive case studies on how top apps grow organically through TikTok, Instagram, and YouTube.",
};

export const dynamic = "force-dynamic";

export default async function CaseStudiesPage() {
  const caseStudies = await getAllCaseStudies();

  return (
    <section className="pt-24 pb-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-8 h-[3px] bg-highlight" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Research
            </span>
          </div>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            Case Studies
          </h1>
          <p className="text-lg text-muted max-w-xl">
            Deep-dive breakdowns of how apps grow organically — with specific
            numbers, strategies, and formats you can replicate.
          </p>
        </div>

        {/* List */}
        <div className="border-t-2 border-foreground divide-y divide-card-border">
          {caseStudies.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className="group grid grid-cols-1 md:grid-cols-12 gap-4 py-6 hover:bg-cream transition-colors -mx-4 px-4"
            >
              {/* Date col */}
              <div className="md:col-span-2">
                <span className="text-xs text-muted">{cs.date}</span>
              </div>

              {/* Content */}
              <div className="md:col-span-7">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-highlight">
                    {cs.tag}
                  </span>
                  {cs.premium && (
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted border border-card-border px-1.5 py-0.5">
                      Pro
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold tracking-tight group-hover:text-muted transition-colors">
                  {cs.title}
                </h3>
                <p className="text-sm text-muted mt-1 hidden sm:block">
                  {cs.description}
                </p>
              </div>

              {/* Metric + read time */}
              <div className="md:col-span-3 flex md:flex-col md:items-end md:justify-center gap-3 md:gap-1">
                <span className="text-sm font-bold text-success">
                  {cs.metric}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Clock className="h-3 w-3" />
                  {cs.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {caseStudies.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p>No case studies yet. Check back soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}
