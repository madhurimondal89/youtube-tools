"use client";

import { useState } from "react";
import { Search, Loader2, Play, Sparkles, Download, Calculator, ShieldCheck, Key, Zap, CheckCircle2, Type, FileText } from "lucide-react";
import type { Tool } from "@/lib/tools-registry";
import { useApiKeys } from "@/context/api-keys-context";

const YT_API_TOOLS = [
  "channel-analyzer",
  "channel-compare",
  "video-comparator",
  "channel-growth-predictor",
  "playlist-analyzer",
  "comment-sentiment-analyzer",
  "youtube-search-explorer",
];

interface ToolInputFormProps {
  tool: Tool;
  initialValue?: string;
  onAnalyze: (input: string) => void;
  loading: boolean;
}

export function ToolInputForm({
  tool,
  initialValue = "",
  onAnalyze,
  loading,
}: ToolInputFormProps) {
  const { openModal, hasGeminiKey, hasYoutubeKey, hasCustomAiKey } = useApiKeys();
  const isAI = tool.category === "ai" || tool.isAI;
  const isYtApi = YT_API_TOOLS.includes(tool.id);
  const isDownload = tool.category === "download";
  const isCalculator = tool.category === "calculators";

  // Dedicated multi-field state
  const [input, setInput] = useState(initialValue);
  const [fieldA, setFieldA] = useState(tool.id === "course-sales-estimator" ? initialValue : "");
  const [fieldB, setFieldB] = useState(tool.id === "course-sales-estimator" ? "97" : "");
  const [fieldC, setFieldC] = useState(tool.id === "course-sales-estimator" ? "1.0" : "");

  const isMultiField = [
    "cpm-calculator",
    "rpm-calculator",
    "video-roi-calculator",
    "engagement-rate-calculator",
    "timestamp-link-generator",
    "competitor-channel-compare",
    "competitor-tag-comparator",
    "course-sales-estimator",
  ].includes(tool.id);

  const isTitleTool = tool.id === "capitalize-my-title";
  const isWordCounter = tool.id === "word-character-counter" || tool.id === "word-counter";

  const placeholder = isTitleTool
    ? "Enter your video title here (e.g. 10 powerful habits of successful creators)..."
    : isWordCounter
    ? "Type/paste text, description, or script (or paste YouTube video URL to analyze)..."
    : isAI
    ? `Enter topic, niche, or title for ${tool.shortName}...`
    : isDownload
    ? "Paste YouTube Video or Shorts URL (e.g. https://www.youtube.com/watch?v=...)..."
    : isCalculator
    ? "Enter view count, revenue, or channel URL..."
    : "Paste YouTube video URL, channel link, or @username...";

  const buttonLabel = loading
    ? "Processing..."
    : isTitleTool
    ? "Capitalize Title"
    : isWordCounter
    ? "Count Words & Characters"
    : isDownload
    ? "Fetch & Download"
    : isAI
    ? "Generate with AI"
    : isCalculator
    ? "Calculate Metrics"
    : "Analyze Now";

  const isSubmitDisabled = loading || (
    isMultiField
      ? tool.id === "engagement-rate-calculator"
        ? !input.trim() && (!fieldA.trim() || !fieldB.trim())
        : tool.id === "timestamp-link-generator"
        ? !fieldA.trim()
        : tool.id === "course-sales-estimator"
        ? !fieldA.trim()
        : !fieldA.trim() || !fieldB.trim()
      : !input.trim()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    if (tool.id === "cpm-calculator") {
      onAnalyze(`${fieldA},${fieldB}`);
    } else if (tool.id === "rpm-calculator") {
      onAnalyze(`${fieldA},${fieldB}`);
    } else if (tool.id === "video-roi-calculator") {
      onAnalyze(`${fieldA},${fieldB}`);
    } else if (tool.id === "course-sales-estimator") {
      onAnalyze(`${fieldA.trim()},${fieldB.trim() || "97"},${fieldC.trim() || "1.0"}`);
    } else if (tool.id === "engagement-rate-calculator") {
      if (input.trim()) {
        onAnalyze(input.trim());
      } else {
        onAnalyze(`${fieldA},${fieldB},${fieldC || "0"}`);
      }
    } else if (tool.id === "timestamp-link-generator") {
      onAnalyze(`${fieldA},${fieldB || "0"}`);
    } else if (tool.id === "competitor-channel-compare" || tool.id === "competitor-tag-comparator") {
      onAnalyze(`${fieldA} vs ${fieldB}`);
    } else {
      onAnalyze(input.trim());
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="font-semibold text-base mb-4 flex items-center gap-2 text-foreground">
        {isTitleTool ? (
          <Type className="w-4 h-4 text-amber-500" />
        ) : isWordCounter ? (
          <FileText className="w-4 h-4 text-emerald-500" />
        ) : isDownload ? (
          <Download className="w-4 h-4 text-red-500" />
        ) : isAI ? (
          <Sparkles className="w-4 h-4 text-purple-500" />
        ) : isCalculator ? (
          <Calculator className="w-4 h-4 text-emerald-500" />
        ) : (
          <Play className="w-4 h-4 text-red-500 fill-red-500" />
        )}
        {isTitleTool
          ? "Enter your video title to convert capitalization"
          : isWordCounter
          ? "Enter text, script, or description (or paste YouTube video link)"
          : isAI
          ? "Enter your topic, title, or keywords"
          : isDownload
          ? "Paste YouTube Video / Shorts link"
          : isCalculator
          ? "Enter your calculation parameters"
          : "Enter YouTube URL or search query"}
      </h2>

      {/* Selective BYOK API Banners (Only for AI & YouTube API Tools) */}
      {isAI && (
        <div className="mb-4">
          {hasGeminiKey || hasCustomAiKey ? (
            <div className="flex items-center justify-between rounded-xl bg-purple-500/10 border border-purple-500/20 px-3.5 py-2 text-xs text-purple-700 dark:text-purple-300">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-semibold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Unlimited AI Mode Active
                </span>
                <span className="text-muted-foreground hidden sm:inline">
                  · Connected via {hasCustomAiKey ? "Custom Provider" : "Gemini"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => openModal(hasCustomAiKey ? "custom-ai" : "gemini")}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                Manage Key
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-purple-500/5 border border-purple-500/20 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
                <span>
                  <strong className="text-foreground font-semibold">Instant Free Mode:</strong> Works immediately without any API key.
                </span>
              </div>
              <button
                type="button"
                onClick={() => openModal("custom-ai")}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline whitespace-nowrap cursor-pointer flex items-center gap-1 sm:ml-auto"
              >
                Connect Free AI Key (Groq/Gemini) <Zap className="w-3 h-3 text-amber-500" />
              </button>
            </div>
          )}
        </div>
      )}

      {isYtApi && (
        <div className="mb-4">
          {hasYoutubeKey ? (
            <div className="flex items-center justify-between rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2 text-xs text-red-700 dark:text-red-300">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-semibold">⚡ Direct YouTube API Quota Active</span>
              </div>
              <button
                type="button"
                onClick={() => openModal("youtube")}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
              >
                Manage Key
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-blue-500/5 border border-blue-500/20 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Key className="h-4 w-4 text-blue-500 shrink-0" />
                <span>
                  <strong className="text-foreground font-semibold">Public Scraper Active:</strong> Works immediately without any API key.
                </span>
              </div>
              <button
                type="button"
                onClick={() => openModal("youtube")}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap cursor-pointer sm:ml-auto"
              >
                Optional: Connect YouTube Key →
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Standard single input or engagement video URL */}
        {(!isMultiField || tool.id === "engagement-rate-calculator") && (
          <div>
            {tool.id === "engagement-rate-calculator" && (
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Option 1: Paste YouTube Video URL (auto-fetches views & likes)
              </label>
            )}
            {isWordCounter ? (
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholder}
                  rows={4}
                  className="w-full p-3.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground resize-y font-sans leading-relaxed"
                  disabled={loading}
                />
                <div className="flex items-center justify-between mt-1 px-1 text-[11px] text-muted-foreground">
                  <span>💡 Tip: Type your text OR paste any YouTube video URL to auto-analyze its description.</span>
                  <span className="font-mono">{input.length} characters</span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
                  disabled={loading}
                />
              </div>
            )}
          </div>
        )}

        {/* Multi-field custom UI */}
        {tool.id === "engagement-rate-calculator" && (
          <div className="pt-2 border-t border-border/60">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Option 2: Or enter custom metrics manually
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="number"
                  value={fieldA}
                  onChange={(e) => setFieldA(e.target.value)}
                  placeholder="Views (e.g. 50000)"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={fieldB}
                  onChange={(e) => setFieldB(e.target.value)}
                  placeholder="Likes (e.g. 3500)"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={fieldC}
                  onChange={(e) => setFieldC(e.target.value)}
                  placeholder="Comments (e.g. 420)"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
                />
              </div>
            </div>
          </div>
        )}

        {tool.id === "cpm-calculator" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Total Ad Spend ($)
              </label>
              <input
                type="number"
                value={fieldA}
                onChange={(e) => setFieldA(e.target.value)}
                placeholder="e.g. 250"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Total Ad Impressions
              </label>
              <input
                type="number"
                value={fieldB}
                onChange={(e) => setFieldB(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
          </div>
        )}

        {tool.id === "rpm-calculator" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Total Creator Revenue ($)
              </label>
              <input
                type="number"
                value={fieldA}
                onChange={(e) => setFieldA(e.target.value)}
                placeholder="e.g. 450"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Total Views
              </label>
              <input
                type="number"
                value={fieldB}
                onChange={(e) => setFieldB(e.target.value)}
                placeholder="e.g. 100000"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
          </div>
        )}

        {tool.id === "video-roi-calculator" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Video Production Cost ($)
              </label>
              <input
                type="number"
                value={fieldA}
                onChange={(e) => setFieldA(e.target.value)}
                placeholder="e.g. 350 (Editor, Gear, etc.)"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Expected Lifetime Revenue ($)
              </label>
              <input
                type="number"
                value={fieldB}
                onChange={(e) => setFieldB(e.target.value)}
                placeholder="e.g. 1200 (AdSense, Affiliates)"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
          </div>
        )}

        {tool.id === "timestamp-link-generator" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                YouTube Video URL
              </label>
              <input
                type="text"
                value={fieldA}
                onChange={(e) => setFieldA(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Target Timestamp
              </label>
              <input
                type="text"
                value={fieldB}
                onChange={(e) => setFieldB(e.target.value)}
                placeholder="e.g. 3:45 or 225"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
          </div>
        )}

        {(tool.id === "competitor-channel-compare" || tool.id === "competitor-tag-comparator") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {tool.id === "competitor-channel-compare" ? "Channel 1 (Handle or URL)" : "Video 1 URL"}
              </label>
              <input
                type="text"
                value={fieldA}
                onChange={(e) => setFieldA(e.target.value)}
                placeholder={tool.id === "competitor-channel-compare" ? "@MrBeast" : "https://youtube.com/watch?v=..."}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {tool.id === "competitor-channel-compare" ? "Channel 2 (Handle or URL)" : "Video 2 URL"}
              </label>
              <input
                type="text"
                value={fieldB}
                onChange={(e) => setFieldB(e.target.value)}
                placeholder={tool.id === "competitor-channel-compare" ? "@MarkRober" : "https://youtube.com/watch?v=..."}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
              />
            </div>
          </div>
        )}

        {tool.id === "course-sales-estimator" && (
          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Audience / Subscribers (or YouTube Channel URL / Handle)
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={fieldA}
                  onChange={(e) => setFieldA(e.target.value)}
                  placeholder="e.g. 25000 or @mkbhd or channel URL"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Enter your estimated audience size or paste any YouTube Channel link/handle to auto-detect subscribers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Course / Product Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">$</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={fieldB}
                    onChange={(e) => setFieldB(e.target.value)}
                    placeholder="97"
                    className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Expected Conversion Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.01"
                    max="100"
                    step="0.1"
                    value={fieldC}
                    onChange={(e) => setFieldC(e.target.value)}
                    placeholder="1.0"
                    className="w-full pr-8 pl-3 py-2.5 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary transition-colors text-foreground"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-semibold">%</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Typical creator benchmark: 0.5% (cold) to 2.5% (warm email list).
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground shadow"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isDownload ? (
            <Download className="w-4 h-4" />
          ) : isAI ? (
            <Sparkles className="w-4 h-4" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          {buttonLabel}
        </button>
      </form>
    </div>
  );
}
