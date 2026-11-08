import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { ToolsGrid } from "@/components/home/tools-grid";
import { StatsSection } from "@/components/home/stats-section";
import { FeaturedTools } from "@/components/home/featured-tools";
import { HowItWorks } from "@/components/home/how-it-works";

export const metadata: Metadata = {
  title: "YouTube Creator Toolkit Pro — 60+ Pro YouTube Tools for Creators",
  description:
    "60+ Pro YouTube tools for creators — AI script writer, tag extractor, SEO audit, monetization checker, HD thumbnail downloader, and revenue calculators. 100% Free.",
  alternates: {
    canonical: "/",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "YouTube Creator Toolkit Pro",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://freeyoutubetools.com",
  description:
    "60+ pro YouTube tools for creators — AI scriptwriting, SEO tags, analytics, thumbnail tools, and calculators.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/tools?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HeroSection />
      <StatsSection />
      <FeaturedTools />
      <HowItWorks />
      <ToolsGrid />
    </>
  );
}
