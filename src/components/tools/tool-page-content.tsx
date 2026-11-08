"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
