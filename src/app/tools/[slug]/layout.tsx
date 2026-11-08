import { notFound } from "next/navigation";
import { getToolBySlug, getRelatedTools, TOOLS } from "@/lib/tools-registry";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { RelatedTools } from "@/components/tools/related-tools";
import { ToolFAQ } from "@/components/tools/tool-faq";
import type { ReactNode } from "react";

interface ToolLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function ToolLayout({ children, params }: ToolLayoutProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const related = getRelatedTools(tool, 4);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: tool.name, href: `/tools/${tool.slug}`, current: true },
  ];

  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `${process.env.NEXT_PUBLIC_APP_URL}/tools/${tool.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((bc, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: bc.label,
      item: `${process.env.NEXT_PUBLIC_APP_URL}${bc.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen">
        {/* Tool Header */}
        <div className="border-b border-border bg-card/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-4 flex items-start gap-4">
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-lg shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${tool.color}ee, ${tool.color}88)`,
                }}
              >
                <span className="text-2xl font-bold">{tool.name[0]}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold">{tool.name}</h1>
                  {tool.isAI && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-full">
                      AI Powered
                    </span>
                  )}
                  <span className="px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full">
                    Free
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground max-w-2xl">
                  {tool.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main */}
            <div className="lg:col-span-3 space-y-8 min-w-0">
              {children}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <RelatedTools tools={related} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}
