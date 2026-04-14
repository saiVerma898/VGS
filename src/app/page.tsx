import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CaseStudyPreview from "@/components/CaseStudyPreview";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Newsletter from "@/components/Newsletter";
import FAQ from "@/components/FAQ";
import { getLatestCaseStudies } from "@/lib/case-studies";

export const dynamic = "force-dynamic";

export default async function Home() {
  const studies = await getLatestCaseStudies(4);

  return (
    <>
      <Hero />
      <Features />
      <CaseStudyPreview studies={studies} />
      <Testimonials />
      <Pricing />
      <Newsletter />
      <FAQ />
    </>
  );
}
