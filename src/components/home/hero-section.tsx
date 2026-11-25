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
    <section className="relative min-h-[75dvh] flex items-center justify-center overflow-hidden py-16 border-b border-border/60 workbench-pattern">
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Technical Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border bg-card/80 text-foreground text-xs font-medium mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>60+ Pro YouTube Creator Tools, Free Without Registration</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 text-foreground">
          The Professional{" "}
          <span className="accent-heading">YouTube Creator</span>
          <br />
          Toolkit
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Extract competitor tags, write viral scripts, audit channel SEO, download 4K thumbnails, and calculate revenue. Direct access, no credentials needed.
        </p>

        {/* Workbench Search Bar */}
        <div className="w-full max-w-3xl mx-auto mb-6">
          <form onSubmit={handleSubmit}>
            <div className="relative flex flex-col sm:flex-row rounded-xl border border-border bg-card shadow-xs overflow-hidden focus-within:border-primary/80 focus-within:ring-1 focus-within:ring-primary/30 transition-colors">
              {/* Tool Selector */}
              <select
                value={selectedTool.slug}
                onChange={(e) => {
                  const t = TOOLS.find((t) => t.slug === e.target.value);
                  if (t) setSelectedTool(t);
                }}
                aria-label="Select YouTube tool"
                className="px-4 py-3 bg-muted/40 text-xs sm:text-sm font-medium border-b sm:border-b-0 sm:border-r border-border outline-none cursor-pointer text-foreground"
              >
                {TOOLS.map((t) => (
                  <option key={t.slug} value={t.slug} className="bg-background text-foreground">
                    {t.name}
                  </option>
                ))}
              </select>

              {/* URL / Topic Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Paste YouTube Video / Shorts URL, Channel @handle, or topic..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-5 py-3 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shrink-0 cursor-pointer"
              >
                <span>Run Tool</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Examples */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">Quick sample:</span>
            {EXAMPLE_URLS.map((u, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(u)}
                className="font-mono text-[11px] px-2.5 py-1 rounded-md border border-border/60 bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {u.startsWith("http") ? u.slice(0, 26) + "..." : u}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Tools Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-3xl mx-auto pt-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Popular:</span>
          {POPULAR_TOOLS.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/70 bg-card hover:border-primary/40 text-xs font-medium transition-colors text-foreground shadow-2xs"
            >
              <span>{t.shortName}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
