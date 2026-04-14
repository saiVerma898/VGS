import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CaseStudyListing } from "@/lib/types/case-study";

interface Props {
  studies: CaseStudyListing[];
}

export default function CaseStudyPreview({ studies }: Props) {
  if (studies.length === 0) return null;

  const lead = studies[0];
  const rest = studies.slice(1);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-8 h-[3px] bg-highlight" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
                Latest Research
              </span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Case Studies
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-muted transition-colors link-underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="border-t-2 border-foreground">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Lead story */}
            <Link
              href={`/case-studies/${lead.slug}`}
              className="lg:col-span-3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-card-border group hover:bg-cream transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-highlight">
                  {lead.tag}
                </span>
                <span className="text-[11px] text-muted">
                  {lead.readTime} read
                </span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-black tracking-tight mb-3 group-hover:text-muted transition-colors">
                {lead.title}
              </h3>
              <p className="text-[15px] text-muted leading-relaxed mb-4">
                {lead.description}
              </p>
              <span className="text-sm font-bold text-success">
                {lead.metric}
              </span>
            </Link>

            {/* Side stack */}
            <div className="lg:col-span-2 divide-y divide-card-border">
              {rest.map((cs) => (
                <Link
                  key={cs.slug}
                  href={`/case-studies/${cs.slug}`}
                  className="block p-6 group hover:bg-cream transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-highlight">
                      {cs.tag}
                    </span>
                    <span className="text-[11px] text-muted">
                      {cs.readTime} read
                    </span>
                  </div>
                  <h4 className="text-sm font-bold mb-1 group-hover:text-muted transition-colors">
                    {cs.title}
                  </h4>
                  <span className="text-xs font-bold text-success">
                    {cs.metric}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
