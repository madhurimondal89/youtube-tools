"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { TOOLS } from "@/lib/tools-registry";
import Link from "next/link";

const EXAMPLE_URLS = [
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://youtube.com/shorts/5k_K0yV8s9g",
  "@MrBeast",
  "https://www.youtube.com/@veritasium",
];

const POPULAR_TOOLS = TOOLS.filter((t) => t.popular && !t.comingSoon).slice(0, 8);

export function HeroSection() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [selectedTool, setSelectedTool] = useState(TOOLS.find((t) => !t.comingSoon) || TOOLS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const params = new URLSearchParams({ url: input.trim() });
    router.push(`/tools/${selectedTool.slug}?${params}`);
  };

  return (
    <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden py-16">
      {/* Static background gradients */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_hsl(var(--background))_70%)]" />

      {/* Static soft ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>60+ Pro YouTube Creator Tools — No Signup Required</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 text-foreground">
          The All-In-One{" "}
          <span className="gradient-text">YouTube Creator</span>
          <br />
          Toolkit Pro
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Extract competitor tags, write viral AI scripts, audit channel SEO, download HD thumbnails, and calculate revenue — 100% free with no signup.
        </p>

        {/* Search Box */}
        <div className="w-full max-w-3xl mx-auto mb-6">
          <form onSubmit={handleSubmit}>
            <div className="relative flex flex-col sm:flex-row rounded-2xl border-2 border-border bg-card shadow-lg overflow-hidden focus-within:border-primary transition-colors">
              {/* Tool Selector */}
              <select
                value={selectedTool.slug}
                onChange={(e) => {
                  const t = TOOLS.find((t) => t.slug === e.target.value);
                  if (t) setSelectedTool(t);
                }}
                aria-label="Select YouTube tool"
                className="px-4 py-3.5 bg-muted/50 text-xs sm:text-sm font-semibold border-b sm:border-b-0 sm:border-r border-border outline-none cursor-pointer text-foreground"
              >
                {TOOLS.map((t) => (
                  <option key={t.slug} value={t.slug} className="bg-card text-foreground">
                    {t.name}
                  </option>
                ))}
              </select>

              {/* URL / Topic Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Paste YouTube Video / Shorts URL, Channel @handle, or topic..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-6 py-3.5 bg-primary text-primary-foreground text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shrink-0"
              >
                <span>Run Tool</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Examples */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Try sample:</span>
            {EXAMPLE_URLS.map((u, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(u)}
                className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                {u.startsWith("http") ? u.slice(0, 26) + "..." : u}
              </button>
            ))}
          </div>
        </div>

        {/* Spotlight Quick Access Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto pt-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Popular Tools:</span>
          {POPULAR_TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-medium transition-colors text-foreground shadow-sm"
            >
              <span>{t.shortName}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
