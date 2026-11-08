import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getToolBySlug, TOOLS } from "@/lib/tools-registry";
import { ToolPageContent } from "@/components/tools/tool-page-content";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ url?: string; q?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const title = `${tool.name} — Free YouTube Tool`;
  const description = `${tool.description} Free, no signup required. Works with any YouTube URL.`;
  const url = `${process.env.NEXT_PUBLIC_APP_URL || ""}/tools/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/tools/${slug}` },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ToolPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { url, q } = await searchParams;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return <ToolPageContent tool={tool} initialUrl={url} initialQuery={q} />;
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}
