import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight, Sparkles } from "lucide-react";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-data";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://freeyoutubetools.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  const url = `${APP_URL}/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/og-image.png"],
    },
  };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${APP_URL}/og-image.png`,
    author: {
      "@type": "Organization",
      name: "YouTube Creator Toolkit Pro",
      url: APP_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "YouTube Creator Toolkit Pro",
      url: APP_URL,
      logo: {
        "@type": "ImageObject",
        url: `${APP_URL}/icon.svg`,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `${APP_URL}/blog/${post.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: APP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${APP_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${APP_URL}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="min-h-screen py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          {/* Header */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Featured Related Tool Banner */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                Recommended Free Tool
              </div>
              <h3 className="text-base font-bold text-foreground">
                {post.relatedTool.name}
              </h3>
              <p className="text-xs text-muted-foreground max-w-lg">
                {post.relatedTool.desc}
              </p>
            </div>
            <Link
              href={`/tools/${post.relatedTool.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shrink-0 shadow-sm"
            >
              <span>Try Free Tool</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Article Body */}
          <div className="prose dark:prose-invert max-w-none space-y-8 text-foreground/90 leading-relaxed">
            {post.content.map((sec, i) => (
              <section key={i} className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground pt-2">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p, j) => (
                  <p key={j} className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}

                {sec.tips && sec.tips.length > 0 && (
                  <div className="rounded-xl border border-border bg-card p-5 space-y-2 mt-3">
                    <div className="font-semibold text-xs text-primary uppercase tracking-wider">
                      💡 Pro Tips
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-foreground/90">
                      {sec.tips.map((tip, k) => (
                        <li key={k}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-bold text-foreground">Ready to optimize your channel?</div>
              <div className="text-xs text-muted-foreground">Access all 60+ free YouTube creator tools anytime.</div>
            </div>
            <Link
              href="/tools"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Browse All Free Tools →
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
