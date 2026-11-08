"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Key,
  Zap,
} from "lucide-react";
import { TOOL_CATEGORIES } from "@/lib/tools-registry";
import { useApiKeys } from "@/context/api-keys-context";

const navLinks = [
  { href: "/tools", label: "All Tools" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { openModal, hasGeminiKey, hasYoutubeKey, hasCustomAiKey } = useApiKeys();

  const hasAnyKey = hasGeminiKey || hasYoutubeKey || hasCustomAiKey;
  const categories = Object.entries(TOOL_CATEGORIES);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/60 shadow-sm transition-colors">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md group-hover:shadow-red-500/30 transition-shadow">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-bold text-sm tracking-tight text-foreground">YouTube Creator</span>
                <span className="text-xs text-muted-foreground font-medium">Toolkit Pro</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {/* Tools Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-foreground">
                  All Tools
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {toolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full left-0 pt-1.5 w-80 z-50 before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']"
                    >
                      <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-3 shadow-2xl">
                        <div className="grid grid-cols-1 gap-1">
                          {categories.map(([key, cat]) => (
                            <Link
                              key={key}
                              href={`/tools?category=${key}`}
                              className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-accent transition-colors group"
                            >
                              <div
                                className="flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold shrink-0"
                                style={{ backgroundColor: cat.color }}
                              >
                                {cat.label[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-foreground">{cat.label}</div>
                                <div className="text-[11px] text-muted-foreground truncate">{cat.description}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-border">
                          <Link
                            href="/tools"
                            className="flex items-center justify-center gap-1 py-1.5 text-xs font-bold text-primary hover:underline"
                          >
                            Explore all 60+ tools →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-foreground"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/tools/ai-script-writer"
                className="flex items-center gap-1.5 ml-2 px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white hover:opacity-90 transition-opacity shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                AI Tools
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal()}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  hasAnyKey
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 shadow-sm"
                    : "border-border/80 bg-accent/40 text-foreground hover:bg-accent hover:border-border"
                }`}
                title="Configure custom Gemini or YouTube API Keys for Unlimited quota"
              >
                <Key className={`w-3.5 h-3.5 ${hasAnyKey ? "text-emerald-500" : "text-amber-500"}`} />
                <span className="hidden sm:inline">API Keys</span>
                {hasAnyKey ? (
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                ) : (
                  <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-muted-foreground font-normal">
                    <Zap className="w-2.5 h-2.5 text-amber-500" /> Free
                  </span>
                )}
              </button>

              {mounted ? (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-border/70 hover:bg-accent transition-colors cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4.5 h-4.5 text-amber-400" />
                  ) : (
                    <Moon className="w-4.5 h-4.5 text-slate-700" />
                  )}
                </button>
              ) : (
                <div className="w-9 h-9 rounded-xl border border-transparent" />
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-background pt-16 overflow-y-auto md:hidden"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 rounded-xl hover:bg-accent font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={() => {
                  setMobileOpen(false);
                  openModal();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                  hasAnyKey
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-border/80 bg-accent/40 text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Key className={`w-4 h-4 ${hasAnyKey ? "text-emerald-500" : "text-amber-500"}`} />
                  <span>Custom API Keys (BYOK)</span>
                </div>
                {hasAnyKey ? (
                  <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">Active</span>
                ) : (
                  <span className="text-xs text-muted-foreground font-normal">Connect free key →</span>
                )}
              </button>
              <div className="pt-4 border-t border-border">
                <p className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tool Categories
                </p>
                {categories.map(([key, cat]) => (
                  <Link
                    key={key}
                    href={`/tools?category=${key}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-accent transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="font-medium text-sm">{cat.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
