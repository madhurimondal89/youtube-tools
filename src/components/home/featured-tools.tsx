"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { TOOLS } from "@/lib/tools-registry";
import * as LucideIcons from "lucide-react";
import { LucideProps } from "lucide-react";

const FEATURED = TOOLS.filter((t) => t.popular && !t.comingSoon).slice(0, 6);

function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!Icon) return <Star {...props} />;
  return <Icon {...props} />;
}

export function FeaturedTools() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold mb-3">
            <Star className="w-3.5 h-3.5 fill-current" />
            Most Popular Creator Tools
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
            Start with the <span className="gradient-text">Creator Favorites</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            These tools are used by thousands of YouTube creators daily to optimize workflow and growth.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED.map((tool) => (
            <Link key={tool.id} href={`/tools/${tool.slug}`} className="group block select-none">
              <div className="relative rounded-2xl border border-border bg-card p-6 transition-colors duration-150 hover:border-primary/60 hover:bg-accent/20">
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0 text-white shadow"
                    style={{
                      background: `linear-gradient(135deg, ${tool.color}ee, ${tool.color}99)`,
                    }}
                  >
                    <DynamicIcon name={tool.icon} className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors text-foreground">
                        {tool.name}
                      </h3>
                      {tool.isAI && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-gradient-to-r from-red-500 to-purple-500 text-white rounded">
                          AI
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] capitalize">
                    {tool.category}
                  </span>
                  <span className="text-muted-foreground group-hover:text-primary flex items-center gap-1 font-medium transition-colors">
                    Try Now <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow"
          >
            Explore all 60+ Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
