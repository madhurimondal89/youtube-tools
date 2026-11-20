import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://freeyoutubetools.com";

export const metadata: Metadata = {
  title: "Creator Blog — YouTube Tips & Growth Guides",
  description:
    "Free YouTube creator tutorials, monetization strategies, SEO blueprints, and thumbnail optimization tips to grow your channel.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Creator Blog — YouTube Tips & Growth Guides",
    description:
      "Free YouTube creator tutorials, monetization strategies, SEO blueprints, and thumbnail optimization tips.",
    url: `${APP_URL}/blog`,
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YouTube Creator Toolkit Pro Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creator Blog — YouTube Tips & Growth Guides",
    description:
      "Free YouTube creator tutorials, monetization strategies, SEO blueprints, and thumbnail optimization tips.",
    images: ["/og-image.png"],
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Monetization: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  SEO: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  Growth: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Earnings: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "AI Tools": "bg-pink-500/10 text-pink-600 dark:text-pink-400",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">
            <span className="gradient-text">Creator</span> Blog
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tips, tutorials, and step-by-step guides to help you grow your YouTube channel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="group rounded-2xl border border-border bg-card p-6 h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      CATEGORY_COLORS[post.category] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h2 className="font-bold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="text-xs text-muted-foreground mt-auto pt-2">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
