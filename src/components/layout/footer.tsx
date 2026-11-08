import Link from "next/link";
import { Play, X, Code2, Heart } from "lucide-react";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools-registry";

const popularTools = TOOLS.filter((t) => t.popular).slice(0, 8);

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="font-bold text-sm">YouTube Creator</div>
                <div className="text-xs text-muted-foreground">Toolkit Pro</div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Free YouTube tools for creators. Analyze, optimize and grow your
              channel with 60+ professional tools.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                aria-label="Twitter"
              >
                <X className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                aria-label="GitHub"
              >
                <Code2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">
              Popular Tools
            </h3>
            <ul className="space-y-2.5">
              {popularTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {Object.entries(TOOL_CATEGORIES).map(([key, cat]) => (
                <li key={key}>
                  <Link
                    href={`/tools?category=${key}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-foreground">
              Company
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About Us" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/contact", label: "Contact" },
                { href: "/sitemap.xml", label: "Sitemap" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} YouTube Creator Toolkit Pro. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for
            YouTube creators
          </p>
        </div>
      </div>
    </footer>
  );
}
