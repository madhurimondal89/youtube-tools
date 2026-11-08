import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — YouTube Creator Tips & Tutorials",
  description: "YouTube creator tips, tutorials, and guides to help you grow your channel, improve SEO, and increase earnings.",
  alternates: { canonical: "/blog" },
};

const SAMPLE_POSTS = [
  {
    slug: "how-to-monetize-youtube-channel-2025",
    title: "How to Monetize Your YouTube Channel in 2025",
    excerpt: "Complete guide to YouTube Partner Program requirements, eligibility, and how to maximize your ad revenue.",
    category: "Monetization",
    date: "2025-07-20",
    readTime: "8 min read",
  },
  {
    slug: "youtube-seo-guide-rank-higher",
    title: "YouTube SEO Guide: How to Rank Higher in 2025",
    excerpt: "Master YouTube SEO with our step-by-step guide covering titles, tags, descriptions, thumbnails and more.",
    category: "SEO",
    date: "2025-07-15",
    readTime: "12 min read",
  },
  {
    slug: "best-thumbnail-practices-ctr",
    title: "Best Thumbnail Practices to Boost Your CTR",
    excerpt: "Learn what makes a great YouTube thumbnail and how to design thumbnails that get clicks.",
    category: "Growth",
    date: "2025-07-10",
    readTime: "6 min read",
  },
  {
    slug: "youtube-earnings-calculator-guide",
    title: "How Much Money Does YouTube Pay Per 1000 Views?",
    excerpt: "A deep dive into YouTube RPM, CPM, and what factors affect your actual earnings per 1000 views.",
    category: "Earnings",
    date: "2025-07-05",
    readTime: "10 min read",
  },
  {
    slug: "youtube-shorts-growth-strategy",
    title: "YouTube Shorts Growth Strategy: Complete 2025 Guide",
    excerpt: "How to use YouTube Shorts to rapidly grow your channel, gain subscribers, and boost long-form video views.",
    category: "Growth",
    date: "2025-06-28",
    readTime: "9 min read",
  },
  {
    slug: "ai-tools-youtube-creators",
    title: "Top AI Tools Every YouTube Creator Should Use in 2025",
    excerpt: "From AI title generators to description writers and thumbnail creators — the best AI tools for YouTubers.",
    category: "AI Tools",
    date: "2025-06-20",
    readTime: "7 min read",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Monetization: "bg-emerald-500/10 text-emerald-600",
  SEO: "bg-violet-500/10 text-violet-600",
  Growth: "bg-blue-500/10 text-blue-600",
  Earnings: "bg-amber-500/10 text-amber-600",
  "AI Tools": "bg-pink-500/10 text-pink-600",
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
            Tips, tutorials, and guides to help you grow your YouTube channel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="group rounded-2xl border border-border bg-card p-6 h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[post.category] || "bg-muted text-muted-foreground"}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h2 className="font-bold text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
                <div className="text-xs text-muted-foreground mt-auto">
                  {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
