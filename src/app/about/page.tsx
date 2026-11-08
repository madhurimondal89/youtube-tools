import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — YouTube Creator Toolkit Pro",
  description:
    "Learn about YouTube Creator Toolkit Pro — our mission to provide 100% free, professional-grade tools for video creators worldwide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Creators By Creators</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            About <span className="gradient-text">YouTube Creator Toolkit Pro</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We build free, fast, and accessible creator utilities to help YouTubers grow channels, optimize search visibility, and streamline video production.
          </p>
        </div>

        {/* Mission Pillars */}
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">100% Free Forever</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No paywalls, hidden tiers, or credit card requirements. All tools are completely free to use for hobbyists and professional channels alike.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Privacy-First Architecture</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We never store your personal API keys or video files on remote servers. Custom API keys reside securely in your browser&apos;s local storage.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">Complete Creator Suite</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              From HD thumbnail downloads and transcript extraction to AI video scripting and monetization calculators — everything under one roof.
            </p>
          </div>
        </div>

        {/* Narrative */}
        <div className="rounded-2xl border border-border bg-card/60 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Why We Started</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Content creation is harder than ever. Creators spend countless hours jumping between fragmented websites just to download a thumbnail, check tag SEO, extract audio, or brainstorm titles — only to encounter aggressive ads, paywalls, or mandatory signups.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            YouTube Creator Toolkit Pro was built to eliminate that friction. We engineered a blazing fast Next.js web application equipped with direct YouTube stream resolvers, Google Gemini AI integration, and real-time audio/video processing engines.
          </p>
        </div>

        {/* Call to action */}
        <div className="text-center pt-6 space-y-4">
          <h3 className="text-xl font-bold text-foreground">Ready to elevate your YouTube workflow?</h3>
          <div className="flex justify-center gap-4">
            <Link
              href="/tools"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Explore All 60+ Tools
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 rounded-xl border border-border bg-card font-semibold text-sm hover:bg-accent transition-colors"
            >
              Read Creator Guides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
