"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import type { Tool } from "@/lib/tools-registry";
import { ToolFAQ } from "./tool-faq";
import { ToolInputForm } from "./tool-input-form";
import { ToolResult } from "./tool-result";
import { getToolFAQs } from "@/lib/tool-faqs";
import { useApiKeys } from "@/context/api-keys-context";
import { StandaloneWordCounter } from "./standalone-word-counter";
import { StandaloneTitleCapitalizer } from "./standalone-title-capitalizer";

interface ToolPageContentProps {
  tool: Tool;
  initialUrl?: string;
  initialQuery?: string;
}

export function ToolPageContent({ tool, initialUrl, initialQuery }: ToolPageContentProps) {
  const { geminiKey, youtubeKey, customAiKey, customAiEndpoint, customAiModel } = useApiKeys();
  const [input, setInput] = useState(initialUrl || initialQuery || "");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const faqs = getToolFAQs(tool.id);

  const handleAnalyze = async (inputValue: string) => {
    setInput(inputValue);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({ url: inputValue, tool: tool.id });
      const headers: Record<string, string> = {};
      if (customAiKey) headers["x-custom-ai-key"] = customAiKey;
      if (customAiEndpoint) headers["x-custom-ai-endpoint"] = customAiEndpoint;
      if (customAiModel) headers["x-custom-ai-model"] = customAiModel;
      if (geminiKey) headers["x-gemini-key"] = geminiKey;
      if (youtubeKey) headers["x-youtube-key"] = youtubeKey;

      const res = await fetch(`/api/tools/${tool.id}?${params}`, {
        headers,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "Something went wrong");
      }
      setResult(data as Record<string, unknown>);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isStandalone =
      tool.id === "word-character-counter" ||
      tool.id === "word-counter" ||
      tool.id === "capitalize-my-title";
    const defaultVal = initialUrl || initialQuery;
    if (!isStandalone && defaultVal && defaultVal.trim()) {
      const timer = setTimeout(() => {
        handleAnalyze(defaultVal.trim());
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dedicated Coming Soon View for Tools moving to isolated subdomain
  if (tool.comingSoon) {
    return (
      <div className="space-y-8">
        <div className="rounded-3xl border border-border bg-card/80 backdrop-blur p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mb-6 shadow-inner">
            <Clock className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Subdomain Engine Coming Soon</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
            {tool.name} is Moving to a Dedicated Subdomain
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
            We are setting up a specialized, high-performance media conversion cluster on a dedicated subdomain 
            (coming soon at <code className="px-2 py-0.5 rounded bg-muted text-foreground font-mono text-xs">down.freeyoutubetools.com</code>). 
            This ensures lightning-fast 4K/1080p downloads and crystal-clear 320kbps MP3s without server delays.
          </p>
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium mb-6 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Our main platform remains 100% focused on Creator Growth, AI Tools, SEO Tags, and Channel Analytics!</span>
          </div>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow text-sm"
          >
            Explore 55+ Active Free Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {faqs.length > 0 ? <ToolFAQ toolName={tool.name} faqs={faqs} /> : null}
      </div>
    );
  }

  // Standalone Real-time Interactive Word Counter (No YouTube URL needed)
  if (tool.id === "word-character-counter" || tool.id === "word-counter") {
    return (
      <div className="space-y-8">
        <StandaloneWordCounter />
        {faqs.length > 0 ? <ToolFAQ toolName={tool.name} faqs={faqs} /> : null}
      </div>
    );
  }

  // Standalone Real-time Title Capitalizer (No YouTube URL needed)
  if (tool.id === "capitalize-my-title") {
    return (
      <div className="space-y-8">
        <StandaloneTitleCapitalizer />
        {faqs.length > 0 ? <ToolFAQ toolName={tool.name} faqs={faqs} /> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <ToolInputForm
        tool={tool}
        initialValue={input}
        onAnalyze={handleAnalyze}
        loading={loading}
      />

      {/* Error */}
      {error !== null ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30 p-4 text-sm text-red-600 dark:text-red-400"
        >
          <strong>Error:</strong> {error}
        </motion.div>
      ) : null}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-lg h-8 bg-muted" />
          ))}
        </div>
      ) : null}

      {/* Result */}
      {result !== null && !loading ? (
        <ToolResult tool={tool} data={result} />
      ) : null}

      {/* FAQ */}
      {faqs.length > 0 ? <ToolFAQ toolName={tool.name} faqs={faqs} /> : null}
    </div>
  );
}
