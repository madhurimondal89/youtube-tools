"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Type,
  AlignLeft,
  BookOpen,
  Mic,
  BarChart3,
  Copy,
  Check,
  Download,
  Trash2,
  ChevronDown,
  Sparkles,
  Maximize2,
  Minimize2,
  ArrowUpDown,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function StandaloneWordCounter() {
  const [text, setText] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [copied, setCopied] = useState(false);

  // Real-time calculations
  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return {
        words: 0,
        charsWithSpaces: text.length,
        charsWithoutSpaces: text.replace(/\s/g, "").length,
        paragraphs: 0,
        sentences: 0,
        readingTimeMinutes: 0,
        speakingTimeMinutes: 0,
        speakingTimeSecs: 0,
        avgWordsPerSentence: 0,
        longestSentenceWords: 0,
        shortestSentenceWords: 0,
        readabilityScore: 100,
        topKeywords: [],
      };
    }

    // Words
    const wordsArr = trimmed.split(/\s+/).filter(Boolean);
    const words = wordsArr.length;

    // Characters
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s/g, "").length;

    // Paragraphs
    const paragraphs = text.split(/\n+/).filter((p) => p.trim() !== "").length;

    // Sentences
    const sentencesArr = text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const sentences = sentencesArr.length;

    // Reading & Speaking Time
    const readingTimeMinutes = Math.ceil(words / 200);
    const totalSpeakingSecs = Math.round((words / 140) * 60);
    const speakingTimeMinutes = Math.floor(totalSpeakingSecs / 60);
    const speakingTimeSecs = totalSpeakingSecs % 60;

    // Sentence stats
    const avgWordsPerSentence = sentences > 0 ? +(words / sentences).toFixed(1) : 0;

    let longestSentenceWords = 0;
    let shortestSentenceWords = sentencesArr.length > 0 ? Infinity : 0;

    if (sentencesArr.length > 0) {
      sentencesArr.forEach((s) => {
        const count = s.split(/\s+/).filter(Boolean).length;
        if (count > longestSentenceWords) longestSentenceWords = count;
        if (count > 0 && count < shortestSentenceWords) shortestSentenceWords = count;
      });
      if (shortestSentenceWords === Infinity) shortestSentenceWords = 0;
    }

    // Readability (approximate Flesch Reading Ease index)
    const readabilityScore = Math.max(
      0,
      Math.min(100, Math.round(100 - avgWordsPerSentence * 2.5))
    );

    // Top Keywords
    const stopWords = new Set([
      "the", "a", "an", "and", "or", "to", "in", "of", "is", "for", "with",
      "on", "it", "this", "that", "you", "your", "are", "be", "as", "at",
      "by", "from", "i", "we", "my", "our", "all", "so", "but", "not", "have"
    ]);

    const freqMap: Record<string, number> = {};
    wordsArr.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean.length > 2 && !stopWords.has(clean)) {
        freqMap[clean] = (freqMap[clean] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        word,
        count,
        percentage: Math.round((count / Math.max(1, words)) * 100),
      }));

    return {
      words,
      charsWithSpaces,
      charsWithoutSpaces,
      paragraphs,
      sentences,
      readingTimeMinutes,
      speakingTimeMinutes,
      speakingTimeSecs,
      avgWordsPerSentence,
      longestSentenceWords,
      shortestSentenceWords,
      readabilityScore,
      topKeywords,
    };
  }, [text]);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `word-counter-export-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setText("");
  };

  const handleTransform = (type: "upper" | "lower" | "title" | "clean") => {
    if (!text) return;
    if (type === "upper") {
      setText(text.toUpperCase());
    } else if (type === "lower") {
      setText(text.toLowerCase());
    } else if (type === "title") {
      const minor = new Set(["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by", "with", "in", "of"]);
      const converted = text
        .split("\n")
        .map((line) =>
          line
            .split(" ")
            .map((w, idx, arr) => {
              const lower = w.toLowerCase();
              if (idx === 0 || idx === arr.length - 1 || !minor.has(lower)) {
                return lower.charAt(0).toUpperCase() + lower.slice(1);
              }
              return lower;
            })
            .join(" ")
        )
        .join("\n");
      setText(converted);
    } else if (type === "clean") {
      // Remove double spaces and clean whitespace
      setText(text.replace(/[ \t]+/g, " ").replace(/\n\s*\n\s*\n/g, "\n\n").trim());
    }
  };

  // YouTube limits
  const ytTitlePct = Math.min(100, Math.round((stats.charsWithSpaces / 100) * 100));
  const ytDescPct = Math.min(100, Math.round((stats.charsWithSpaces / 5000) * 100));

  return (
    <div className="space-y-6">
      {/* Editor Box */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Live Word & Character Counter
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Type or paste your text below for instantaneous real-time metrics.
            </p>
          </div>
          {text.length > 0 && (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer text-muted-foreground"
                title="Clear all text"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste your text, script, article, or video description here..."
            rows={9}
            className="w-full p-4 rounded-xl border border-border bg-background text-foreground text-base leading-relaxed outline-none focus:border-emerald-500 transition-colors resize-y font-sans shadow-inner placeholder:text-muted-foreground/60"
            autoFocus
          />
          {text.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer text-xs"
              title="Clear text"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Format & Action Toolbar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-border/60">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-medium mr-1 hidden sm:inline">Case:</span>
            <button
              type="button"
              onClick={() => handleTransform("upper")}
              disabled={!text}
              className="px-2.5 py-1 rounded-lg border border-border bg-muted/30 hover:bg-accent disabled:opacity-40 transition-colors cursor-pointer font-mono font-bold"
            >
              UPPER
            </button>
            <button
              type="button"
              onClick={() => handleTransform("lower")}
              disabled={!text}
              className="px-2.5 py-1 rounded-lg border border-border bg-muted/30 hover:bg-accent disabled:opacity-40 transition-colors cursor-pointer font-mono"
            >
              lower
            </button>
            <button
              type="button"
              onClick={() => handleTransform("title")}
              disabled={!text}
              className="px-2.5 py-1 rounded-lg border border-border bg-muted/30 hover:bg-accent disabled:opacity-40 transition-colors cursor-pointer"
            >
              Title Case
            </button>
            <button
              type="button"
              onClick={() => handleTransform("clean")}
              disabled={!text}
              className="px-2.5 py-1 rounded-lg border border-border bg-muted/30 hover:bg-accent disabled:opacity-40 transition-colors cursor-pointer"
            >
              Clean Spaces
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm disabled:opacity-40 cursor-pointer min-w-[110px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              disabled={!text}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent text-foreground font-semibold text-xs transition-colors shadow-sm disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-muted-foreground" />
              Download TXT
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Words */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 text-center relative overflow-hidden shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2.5">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-foreground tracking-tight">
            {stats.words.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-muted-foreground mt-1">
            Total Words
          </div>
        </div>

        {/* Chars with spaces */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center relative overflow-hidden shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
            <Type className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {stats.charsWithSpaces.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-muted-foreground mt-1">
            Characters (with spaces)
          </div>
        </div>

        {/* Chars without spaces */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 text-center relative overflow-hidden shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2.5">
            <AlignLeft className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-foreground tracking-tight">
            {stats.charsWithoutSpaces.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-muted-foreground mt-1">
            Characters (no spaces)
          </div>
        </div>

        {/* Paragraphs */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 text-center relative overflow-hidden shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2.5">
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-foreground tracking-tight">
            {stats.paragraphs.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-muted-foreground mt-1">
            Paragraphs
          </div>
        </div>
      </div>

      {/* Advanced Metrics Accordion */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-accent/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="font-bold text-base text-foreground">
              Advanced Reading & Sentence Metrics
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
            <span>{showAdvanced ? "Hide" : "Show"}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border/70"
            >
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {/* Reading Time */}
                <div className="p-4 rounded-xl border border-border/80 bg-muted/20">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.readingTimeMinutes} min
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Reading time</div>
                </div>

                {/* Speaking Time */}
                <div className="p-4 rounded-xl border border-border/80 bg-muted/20">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/15 text-pink-500 flex items-center justify-center mx-auto mb-2">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.speakingTimeMinutes}m {stats.speakingTimeSecs}s
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Speaking time</div>
                </div>

                {/* Sentences */}
                <div className="p-4 rounded-xl border border-border/80 bg-muted/20">
                  <div className="w-8 h-8 rounded-lg bg-red-500/15 text-red-500 flex items-center justify-center mx-auto mb-2">
                    <AlignLeft className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.sentences.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Sentences count</div>
                </div>

                {/* Readability Score */}
                <div className="p-4 rounded-xl border border-border/80 bg-muted/20">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-500 flex items-center justify-center mx-auto mb-2">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-500">
                    {stats.readabilityScore}/100
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Readability score</div>
                </div>

                {/* Avg Words Per Sentence */}
                <div className="p-4 rounded-xl border border-border/80 bg-muted/20">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.avgWordsPerSentence}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Avg words/sentence</div>
                </div>

                {/* Longest Sentence */}
                <div className="p-4 rounded-xl border border-border/80 bg-muted/20">
                  <div className="text-2xl font-bold text-amber-500">
                    {stats.longestSentenceWords}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Longest sentence (words)</div>
                </div>

                {/* Shortest Sentence */}
                <div className="p-4 rounded-xl border border-border/80 bg-muted/20">
                  <div className="text-2xl font-bold text-rose-500">
                    {stats.shortestSentenceWords}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Shortest sentence (words)</div>
                </div>

                {/* Avg Word Length */}
                <div className="p-4 rounded-xl border border-border/80 bg-muted/20">
                  <div className="text-2xl font-bold text-foreground">
                    {stats.words > 0 ? (stats.charsWithoutSpaces / stats.words).toFixed(1) : 0}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Avg word length (chars)</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Creator Platform Limit Compliance */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          YouTube & Creator Platform Character Limits
        </h3>

        <div className="space-y-4">
          {/* YouTube Title */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-foreground">YouTube Video Title</span>
              <span className={stats.charsWithSpaces > 100 ? "text-destructive font-bold" : "text-muted-foreground"}>
                {stats.charsWithSpaces} / 100 max ({stats.charsWithSpaces <= 60 ? "Mobile Optimal <60" : stats.charsWithSpaces <= 100 ? "OK (<100)" : "Exceeds Limit!"})
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  stats.charsWithSpaces > 100
                    ? "bg-destructive"
                    : stats.charsWithSpaces <= 60
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${Math.min(100, (stats.charsWithSpaces / 100) * 100)}%` }}
              />
            </div>
          </div>

          {/* YouTube Description */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-foreground">YouTube Video Description</span>
              <span className={stats.charsWithSpaces > 5000 ? "text-destructive font-bold" : "text-muted-foreground"}>
                {stats.charsWithSpaces.toLocaleString()} / 5,000 max
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  stats.charsWithSpaces > 5000 ? "bg-destructive" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, (stats.charsWithSpaces / 5000) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Keywords Density */}
      {stats.topKeywords.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-foreground">Top Keyword Density</h3>
          <p className="text-xs text-muted-foreground">
            Frequently repeated terms for SEO and script analysis:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {stats.topKeywords.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-muted/30 text-xs font-medium text-foreground"
              >
                <strong className="text-primary">{kw.word}</strong>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {kw.count}x ({kw.percentage}%)
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
