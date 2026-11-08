import type { Metadata } from "next";
import { ToolsGrid } from "@/components/home/tools-grid";

export const metadata: Metadata = {
  title: "All YouTube Tools — 60+ Pro YouTube Creator Tools",
  description:
    "Browse all 60+ pro YouTube creator tools — 4K video downloaders, MP3 extractors, AI scriptwriting, tag extractors, earnings calculators, SEO checkers, and channel audits.",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "All YouTube Tools — 60+ Pro YouTube Creator Tools",
    description: "The complete collection of 60+ pro YouTube tools for creators.",
  },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen pt-4 pb-16">
      <ToolsGrid titleTag="h1" isStandalonePage={true} />
    </div>
  );
}
