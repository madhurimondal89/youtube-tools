import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/lib/tools-registry";

export function RelatedTools({ tools }: { tools: Tool[] }) {
  if (!tools.length) return null;
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h3 className="font-semibold text-sm mb-4">Related Tools</h3>
      <div className="space-y-2">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors group"
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold shrink-0"
              style={{ background: `linear-gradient(135deg, ${tool.color}dd, ${tool.color}88)` }}
            >
              {tool.name[0]}
            </div>
            <span className="text-sm font-medium flex-1 group-hover:text-primary transition-colors">
              {tool.shortName}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
      <Link
        href="/tools"
        className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors pt-3 border-t border-border"
      >
        View all tools <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
