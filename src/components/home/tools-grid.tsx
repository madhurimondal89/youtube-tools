"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Star, X, LayoutGrid, RotateCcw } from "lucide-react";
import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from "@/lib/tools-registry";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!Icon) return <Star {...props} />;
  return <Icon {...props} />;
}

interface ToolsGridProps {
  titleTag?: "h1" | "h2";
  isStandalonePage?: boolean;
}

export function ToolsGrid({ titleTag = "h2", isStandalonePage = false }: ToolsGridProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");

  const filtered = TOOLS.filter((tool) => {
    const matchesSearch =
      !search ||
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase()) ||
      tool.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: { key: ToolCategory | "all"; label: string; count: number; icon: string }[] = [
    { key: "all", label: "All Tools", count: TOOLS.length, icon: "LayoutGrid" },
    ...Object.entries(TOOL_CATEGORIES).map(([key, cat]) => ({
      key: key as ToolCategory,
      label: cat.label,
      count: TOOLS.filter((t) => t.category === key).length,
      icon: cat.icon,
    })),
  ];

  const TitleComponent = titleTag;

  return (
    <section className={isStandalonePage ? "py-4" : "py-16"} id="all-tools">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <TitleComponent className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3">
            All <span className="gradient-text">60+ Pro YouTube Tools</span>
          </TitleComponent>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Everything you need to download, analyze, script, optimize, and grow your YouTube channel. 100% free with no signup required.
          </p>
        </div>

        {/* Clean, Centered Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search tools by name, action (e.g. download, subtitles, tags, script)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-border bg-card/90 shadow-sm text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/70"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Organized Category Pills (Wrap neatly, no squishing or clipping) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold scale-[1.02]"
                    : "bg-card border border-border hover:border-border/80 hover:bg-accent/50 text-muted-foreground hover:text-foreground shadow-sm"
                }`}
              >
                {cat.key === "all" ? (
                  <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <DynamicIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Summary & Quick Reset */}
        {(search || activeCategory !== "all") && (
          <div className="flex items-center justify-between mb-6 px-1 text-xs text-muted-foreground">
            <div>
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of {TOOLS.length} tools
              {activeCategory !== "all" && (
                <span> in <span className="font-semibold text-primary capitalize">{activeCategory}</span></span>
              )}
              {search && <span> matching &ldquo;{search}&rdquo;</span>}
            </div>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset filters
            </button>
          </div>
        )}

        {/* Tools Grid — Stable Responsive Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-card/40 rounded-2xl border border-border space-y-3">
            <p className="text-sm font-medium text-foreground">
              No tools found matching &ldquo;{search}&rdquo; in this category.
            </p>
            <p className="text-xs text-muted-foreground">
              Try searching for &ldquo;downloader&rdquo;, &ldquo;captions&rdquo;, &ldquo;tags&rdquo;, or &ldquo;monetization&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Show All Tools
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group block h-full select-none"
              >
                <div className="h-full rounded-2xl border border-border bg-card p-5 transition-all duration-150 hover:border-primary/60 hover:bg-accent/20 hover:shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl text-white shadow shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${tool.color}ee, ${tool.color}99)`,
                        }}
                      >
                        <DynamicIcon name={tool.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors text-foreground">
                            {tool.name}
                          </h3>
                          {tool.isAI && (
                            <span className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-red-500 to-purple-500 text-white rounded">
                              AI
                            </span>
                          )}
                          {tool.popular && (
                            <Star className="shrink-0 w-3.5 h-3.5 text-amber-500 fill-current" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground capitalize font-medium text-[11px]">
                      {tool.category}
                    </span>
                    <span className="text-muted-foreground group-hover:text-primary flex items-center gap-1 font-medium transition-colors">
                      Open <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
