import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight, Sparkles } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  relatedTool: {
    name: string;
    slug: string;
    desc: string;
  };
  content: {
    heading: string;
    paragraphs: string[];
    tips?: string[];
  }[];
}

const POSTS: Record<string, BlogPost> = {
  "how-to-monetize-youtube-channel-2025": {
    slug: "how-to-monetize-youtube-channel-2025",
    title: "How to Monetize Your YouTube Channel in 2025 (Complete Blueprint)",
    excerpt: "Complete guide to YouTube Partner Program requirements, eligibility, RPM metrics, and how to maximize your ad revenue.",
    category: "Monetization",
    date: "2025-07-20",
    readTime: "8 min read",
    relatedTool: {
      name: "Monetization Eligibility Checker",
      slug: "monetization-checker",
      desc: "Check your channel eligibility and see how close you are to YPP approval.",
    },
    content: [
      {
        heading: "1. The Current YouTube Partner Program (YPP) Thresholds",
        paragraphs: [
          "Monetizing a YouTube channel in 2025 has become more accessible with YouTube's tiered Partner Program. There are two primary tiers for creators aiming to turn their video production into sustainable income.",
          "Tier 1 (Fan Funding & Features): Requires 500 subscribers, 3 valid public uploads in the last 90 days, and either 3,000 public watch hours in the past 12 months or 3 million Shorts views in the last 90 days. This unlocks Super Thanks, Super Chats, Channel Memberships, and YouTube Shopping.",
          "Tier 2 (Full Ad Revenue Sharing): Requires 1,000 subscribers and either 4,000 public watch hours over 12 months or 10 million valid Shorts views over 90 days. This unlocks full ad revenue from long-form videos and Shorts feed ads.",
        ],
        tips: [
          "Long-form watch hours and Shorts views do not combine; focus predominantly on one format to hit the threshold quickly.",
          "Ensure your Google AdSense account address and tax forms are verified early to avoid payment delays.",
        ],
      },
      {
        heading: "2. Understanding RPM vs. CPM in 2025",
        paragraphs: [
          "Many creators confuse CPM (Cost Per Mille) with RPM (Revenue Per Mille). CPM is what advertisers pay YouTube for every 1,000 ad impressions, while RPM is what you actually earn per 1,000 total video views after YouTube takes its 45% platform share.",
          "Niches like Personal Finance, Technology, SaaS, and Real Estate command RPMs from $12 to $35+, while gaming, entertainment, and comedy typically hover between $1.50 and $4.00.",
        ],
      },
      {
        heading: "3. Diversifying Beyond AdSense",
        paragraphs: [
          "Top-earning creators earn less than 40% of their total revenue from AdSense. Strategic monetization incorporates sponsorships, digital products, high-ticket affiliate programs, and creator communities.",
        ],
      },
    ],
  },
  "youtube-seo-guide-rank-higher": {
    slug: "youtube-seo-guide-rank-higher",
    title: "YouTube SEO Guide: How to Rank Higher and Dominate Search in 2025",
    excerpt: "Master YouTube SEO with our step-by-step guide covering keyword research, click-worthy titles, video descriptions, and engagement signals.",
    category: "SEO",
    date: "2025-07-15",
    readTime: "12 min read",
    relatedTool: {
      name: "YouTube SEO Score & Audit",
      slug: "youtube-seo-audit",
      desc: "Scan your title, tags, description, and keywords to get an instant SEO score.",
    },
    content: [
      {
        heading: "1. The 2025 YouTube Search Algorithm Explained",
        paragraphs: [
          "YouTube is the world's second largest search engine. The ranking algorithm prioritizes two primary metrics: Search Intent Relevance and Viewer Satisfaction (Click-Through Rate + Average Percentage Viewed).",
          "Keyword stuffing no longer works. Modern ranking is driven by semantic understanding of your video's audio transcript, closed captions, and user behavior after clicking.",
        ],
        tips: [
          "Always say your primary target keyword within the first 15 seconds of your video — YouTube's automated speech recognition indexes it immediately.",
          "Place your main keyword near the beginning of your title and within the first two sentences of your description.",
        ],
      },
      {
        heading: "2. Strategic Tagging and Keyword Placement",
        paragraphs: [
          "While tags play a smaller role than they did a decade ago, they remain crucial for disambiguation and ranking in 'Up Next' recommendation algorithms alongside competitor videos.",
        ],
      },
    ],
  },
  "best-thumbnail-practices-ctr": {
    slug: "best-thumbnail-practices-ctr",
    title: "Best Thumbnail Practices to Boost Your CTR Beyond 10%",
    excerpt: "Learn what makes a great YouTube thumbnail and how to design visual assets that command attention in crowded recommendation feeds.",
    category: "Growth",
    date: "2025-07-10",
    readTime: "6 min read",
    relatedTool: {
      name: "Thumbnail Contrast & Readability Checker",
      slug: "thumbnail-contrast-checker",
      desc: "Test your thumbnail contrast and readability across dark and light YouTube feeds.",
    },
    content: [
      {
        heading: "1. The 3-Second Rule of Thumbnail Design",
        paragraphs: [
          "Mobile viewers scroll past dozens of video suggestions every second. A successful thumbnail conveys a singular emotional story or intrigue within less than 250 milliseconds.",
          "Avoid repeating the video title in your thumbnail text. Instead, use the thumbnail to present a teaser question or visual payoff that complements the title.",
        ],
        tips: [
          "Use high contrast colors (such as vibrant yellow or neon cyan against deep dark backgrounds).",
          "Limit text to 3 to 4 impactful words maximum, sized for readability on a 5-inch smartphone display.",
        ],
      },
    ],
  },
  "youtube-earnings-calculator-guide": {
    slug: "youtube-earnings-calculator-guide",
    title: "How Much Money Does YouTube Pay Per 1,000 Views in 2025?",
    excerpt: "A deep dive into YouTube RPM, CPM, niche multipliers, and what factors dictate your actual take-home earnings per million views.",
    category: "Earnings",
    date: "2025-07-05",
    readTime: "10 min read",
    relatedTool: {
      name: "YouTube Money & Earnings Calculator",
      slug: "youtube-money-calculator",
      desc: "Calculate estimated monthly and annual revenue based on views and niche RPM.",
    },
    content: [
      {
        heading: "1. The View-to-Dollar Calculation Breakdown",
        paragraphs: [
          "On average across all global niches, YouTube creators earn roughly $2 to $7 per 1,000 views on long-form content. Shorts earn significantly less — typically between $0.03 to $0.08 per 1,000 views due to pooled revenue distribution.",
          "Geography plays a massive role: US, UK, Canada, and Australian viewers generate 5x to 10x higher RPM than viewers in developing economies due to purchasing power parity and advertiser bid competition.",
        ],
      },
    ],
  },
  "youtube-shorts-growth-strategy": {
    slug: "youtube-shorts-growth-strategy",
    title: "YouTube Shorts Growth Strategy: The Ultimate Playbook for 2025",
    excerpt: "How to use YouTube Shorts to rapidly build subscriber momentum and systematically funnel viral short-form audiences to your long-form videos.",
    category: "Growth",
    date: "2025-06-28",
    readTime: "9 min read",
    relatedTool: {
      name: "AI Viral Shorts Script Generator",
      slug: "ai-shorts-script",
      desc: "Generate viral 60-second vertical video scripts with psychological hooks and visual cues.",
    },
    content: [
      {
        heading: "1. The 'Swipe-Away' Rate is Your Single Most Important Metric",
        paragraphs: [
          "In YouTube Studio Analytics, the 'Viewed vs. Swiped Away' metric determines whether a Short gets pushed to hundreds of thousands of users. If your 'Viewed' percentage falls below 70%, the algorithm quickly halts distribution.",
          "To keep viewers from swiping, eliminate all greetings, logos, or slow title cards. Start with an action, controversial statement, or intense visual within the first 0.5 seconds.",
        ],
      },
    ],
  },
  "ai-tools-youtube-creators": {
    slug: "ai-tools-youtube-creators",
    title: "Top AI Tools Every YouTube Creator Should Leverage in 2025",
    excerpt: "From AI title generators to automatic chapter writers and voiceover scripting — streamline your entire production workflow.",
    category: "AI Tools",
    date: "2025-06-20",
    readTime: "7 min read",
    relatedTool: {
      name: "AI YouTube Video Title Generator",
      slug: "ai-title-generator",
      desc: "Generate 10 viral, high-CTR YouTube titles tailored to your topic and keywords.",
    },
    content: [
      {
        heading: "1. How AI is Transforming the YouTube Workflow",
        paragraphs: [
          "Creating high quality YouTube content traditionally required days of scripting, editing, and optimization. With modern generative tools, creators can ideate 20 concepts, generate SEO metadata, and outline narrative story arcs in minutes.",
          "The key to winning with AI is using it for rapid ideation and structural drafting, while preserving your authentic human voice, personal storytelling, and unique opinions.",
        ],
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return {};

  return {
    title: `${post.title} — Creator Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS[slug];

  if (!post) {
    notFound();
  }

  return (
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
  );
}

