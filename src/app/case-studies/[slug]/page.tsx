import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import TikTokEmbed from "@/components/TikTokEmbed";
import ScrollPaywall from "@/components/ScrollPaywall";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return { title: "Not Found | VGS" };
  return {
    title: `${study.title} | VGS`,
    description: study.metaDescription || study.description,
    openGraph: {
      title: study.title,
      description: study.description,
      images: study.appIconUrl ? [study.appIconUrl] : [],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);

  if (!study) notFound();

  const hasLinks = study.externalLinks.length > 0;
  const hasScreenshots = study.screenshotUrls.length > 0;
  const hasTikToks = study.tiktokEmbeds.length > 0;

  // Insert TikTok embeds after paragraph 2 and screenshots after paragraph 4
  const tiktokInsertIndex = Math.min(2, study.content.length - 1);
  const screenshotInsertIndex = Math.min(4, study.content.length - 1);

  return (
    <section className="pt-20 sm:pt-24 pb-20 bg-white">
      <ScrollPaywall />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        {/* Back */}
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          All Case Studies
        </Link>

        {/* App header with icon */}
        <div className="flex items-start gap-4 mb-6">
          {study.appIconUrl && (
            <Image
              src={study.appIconUrl}
              alt={study.title}
              width={120}
              height={120}
              className="rounded-3xl border border-card-border shrink-0 shadow-lg"
            />
          )}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-highlight">
                {study.tag}
              </span>
              {study.premium && (
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted border border-card-border px-1.5 py-0.5">
                  Pro
                </span>
              )}
              <span className="text-xs text-muted">{study.date}</span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-[2.5rem] font-black tracking-tight leading-[1.1]">
              {study.title}
            </h1>
          </div>
        </div>

        {/* Stats + links bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b-2 border-foreground">
          <span className="text-sm font-bold text-success">{study.metric}</span>
          <span className="text-sm text-muted">{study.readTime} read</span>
          {hasLinks && (
            <div className="flex items-center gap-2 ml-auto">
              {study.externalLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground transition-colors border border-card-border px-2.5 py-1"
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Content with interleaved media */}
        <article>
          {study.content.map((paragraph, i) => {
            // Premium paywall after paragraph 1
            if (study.premium && i === 1) {
              return (
                <div key={i}>
                  <p className="text-lg text-foreground/85 leading-[1.85] mb-5">
                    {paragraph}
                  </p>
                  <div className="mt-10 border-2 border-foreground p-8 text-center">
                    <Lock className="h-6 w-6 mx-auto mb-3" />
                    <h3 className="font-editorial text-xl font-black mb-2">
                      Pro-Exclusive Case Study
                    </h3>
                    <p className="text-sm text-muted mb-6 max-w-md mx-auto">
                      Full access to this and 2,000+ case studies with VGS Pro.
                    </p>
                    <Link
                      href="/#pricing"
                      className="inline-flex items-center gap-2 bg-foreground text-white px-7 py-3 text-sm font-semibold hover:bg-foreground/90 transition-colors"
                    >
                      Unlock Pro Access
                    </Link>
                  </div>
                </div>
              );
            }
            if (study.premium && i > 1) return null;

            return (
              <div key={i}>
                <p className="text-lg text-foreground/85 leading-[1.85] mb-5">
                  {paragraph}
                </p>

                {/* TikTok embeds after paragraph 2 */}
                {i === tiktokInsertIndex && hasTikToks && (
                  <div className="my-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-block w-6 h-[2px] bg-highlight" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                        TikTok Videos
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {study.tiktokEmbeds
                        .filter((e) => e.embedHtml || e.url)
                        .map((embed, j) => (
                          <TikTokEmbed
                            key={j}
                            embedHtml={embed.embedHtml}
                            url={embed.url}
                            title={embed.title}
                            authorName={embed.authorName}
                            thumbnailUrl={embed.thumbnailUrl}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Screenshots after paragraph 4 */}
                {i === screenshotInsertIndex && hasScreenshots && (
                  <div className="my-8">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-block w-6 h-[2px] bg-highlight" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
                        App Screenshots
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {study.screenshotUrls.map((url, j) => (
                        <Image
                          key={j}
                          src={url}
                          alt={`${study.title} screenshot ${j + 1}`}
                          width={1200}
                          height={0}
                          className="rounded-xl border-2 border-foreground/10 w-full h-auto shadow-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </article>

        {/* Bottom CTA */}
        {!study.premium && (
          <div className="mt-12 pt-8 border-t border-card-border">
            <div className="border-2 border-foreground p-6 text-center">
              <h3 className="font-editorial text-xl font-black mb-2">
                Want More?
              </h3>
              <p className="text-sm text-muted mb-4">
                Pro members get unlimited case studies, competitor intelligence,
                and daily research.
              </p>
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 bg-foreground text-white px-6 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
              >
                Get Pro Access
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
