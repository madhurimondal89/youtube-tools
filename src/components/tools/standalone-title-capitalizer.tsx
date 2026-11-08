"use client";

import { useState, useMemo } from "react";
import {
  Type,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Zap,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface CaseStyle {
  id: string;
  name: string;
  description: string;
  convert: (text: string) => string;
}

const MINOR_WORDS = new Set([
  "a", "an", "the", "and", "but", "or", "nor", "for", "so", "yet",
  "at", "by", "in", "of", "off", "on", "to", "up", "as", "via"
]);

const PRESERVED_TERMS = new Map([
  ["youtube", "YouTube"],
  ["tiktok", "TikTok"],
  ["iphone", "iPhone"],
  ["ipad", "iPad"],
  ["ai", "AI"],
  ["seo", "SEO"],
  ["diy", "DIY"],
  ["api", "API"],
  ["url", "URL"],
  ["ctr", "CTR"],
  ["cpm", "CPM"],
  ["hd", "HD"],
  ["4k", "4K"],
  ["ui", "UI"],
  ["ux", "UX"],
]);

function toTitleCase(text: string): string {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => {
      // Split preserving spaces
      const tokens = line.split(/(\s+)/);
      let wordIndex = 0;
      const wordCount = tokens.filter((t) => /\S/.test(t)).length;
      let prevEndedWithPunct = false;

      return tokens
        .map((token) => {
          if (!/\S/.test(token)) return token; // whitespace

          const isFirst = wordIndex === 0;
          const isLast = wordIndex === wordCount - 1;
          wordIndex++;

          // Separate leading punctuation, core alphanumeric word, and trailing punctuation
          const match = token.match(/^([^a-zA-Z0-9]*)(.*?)([^a-zA-Z0-9]*)$/);
          if (!match) return token;

          const [, leadingPunct, core, trailingPunct] = match;
          if (!core) return token;

          const lowerCore = core.toLowerCase();
          // Always capitalize first word, last word, or word directly following sentence/subtitle boundary (. : ! ? — – -)
          const shouldCapitalize =
            isFirst ||
            isLast ||
            prevEndedWithPunct ||
            !MINOR_WORDS.has(lowerCore);

          // Update punctuation flag for next word
          prevEndedWithPunct = /[.:!?—–\-]/.test(trailingPunct);

          let capitalizedCore = "";
          if (PRESERVED_TERMS.has(lowerCore)) {
            capitalizedCore = PRESERVED_TERMS.get(lowerCore)!;
          } else if (core.includes("-")) {
            // Capitalize hyphenated parts (e.g. Step-by-Step)
            capitalizedCore = core
              .split("-")
              .map((part, pIdx, arr) => {
                const pLower = part.toLowerCase();
                if (PRESERVED_TERMS.has(pLower)) return PRESERVED_TERMS.get(pLower)!;
                if (pIdx === 0 || pIdx === arr.length - 1 || !MINOR_WORDS.has(pLower)) {
                  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
                }
                return pLower;
              })
              .join("-");
          } else {
            capitalizedCore = shouldCapitalize
              ? core.charAt(0).toUpperCase() + core.slice(1).toLowerCase()
              : lowerCore;
          }

          return leadingPunct + capitalizedCore + trailingPunct;
        })
        .join("");
    })
    .join("\n");
}

function toCapitalizeEveryWord(text: string): string {
  if (!text) return "";
  return text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function toSentenceCase(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

function toViralHook(text: string): string {
  if (!text) return "";
  const titleCased = toTitleCase(text);
  const words = titleCased.split(/(\s+)/);
  let nonSpaceCount = 0;
  let splitIndex = -1;
  for (let i = 0; i < words.length; i++) {
    if (/\S/.test(words[i])) {
      nonSpaceCount++;
      if (nonSpaceCount === 2) {
        splitIndex = i;
        break;
      }
    }
  }
  if (splitIndex === -1 || nonSpaceCount < 2) return text.toUpperCase();
  const hook = words.slice(0, splitIndex + 1).join("").toUpperCase();
  const rest = words.slice(splitIndex + 1).join("");
  return hook + rest;
}

function toAlternatingCase(text: string): string {
  if (!text) return "";
  let upper = false;
  return text
    .split("")
    .map((char) => {
      if (/[a-zA-Z]/.test(char)) {
        upper = !upper;
        return upper ? char.toUpperCase() : char.toLowerCase();
      }
      return char;
    })
    .join("");
}

function toKebabCase(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toSnakeCase(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s-]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toCamelCase(text: string): string {
  if (!text) return "";
  const words = text.trim().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("")
  );
}

function toPascalCase(text: string): string {
  if (!text) return "";
  const words = text.trim().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

const CASE_STYLES: CaseStyle[] = [
  {
    id: "title",
    name: "Title Case",
    description: "Standard AP / YouTube style. Capitalizes principal words, keeps prepositions lowercase.",
    convert: toTitleCase,
  },
  {
    id: "capitalize-all",
    name: "Capitalize Every Word",
    description: "Every single word starts with an uppercase letter regardless of parts of speech.",
    convert: toCapitalizeEveryWord,
  },
  {
    id: "viral-hook",
    name: "Viral YouTube Hook",
    description: "FIRST TWO WORDS IN ALL CAPS + Title Case. Proven high-CTR formula used by MrBeast.",
    convert: toViralHook,
  },
  {
    id: "uppercase",
    name: "UPPERCASE (ALL CAPS)",
    description: "All letters converted to capital letters. Great for high-energy Shorts and punchy titles.",
    convert: (t) => t.toUpperCase(),
  },
  {
    id: "sentence",
    name: "Sentence case",
    description: "First letter of each sentence capitalized, all other letters lowercase.",
    convert: toSentenceCase,
  },
  {
    id: "lowercase",
    name: "lowercase",
    description: "All lowercase aesthetic popular in lo-fi, aesthetic vlogs, and chill niches.",
    convert: (t) => t.toLowerCase(),
  },
  {
    id: "alternating",
    name: "AltErNaTiNg cAsE",
    description: "Alternating capital and lowercase letters for meme/humor content.",
    convert: toAlternatingCase,
  },
  {
    id: "kebab",
    name: "kebab-case (URL Slug)",
    description: "Lowercase with hyphens. Ideal for video filenames, URLs, and clean playlist tags.",
    convert: toKebabCase,
  },
  {
    id: "snake",
    name: "snake_case",
    description: "Lowercase with underscores. Great for code, database keys, or project archives.",
    convert: toSnakeCase,
  },
  {
    id: "camel",
    name: "camelCase",
    description: "Compound word where first word is lowercase and subsequent words start uppercase.",
    convert: toCamelCase,
  },
  {
    id: "pascal",
    name: "PascalCase",
    description: "Compound word where every word starts with a capital letter with no spaces.",
    convert: toPascalCase,
  },
];

export function StandaloneTitleCapitalizer() {
  const [title, setTitle] = useState("");
  const [selectedCase, setSelectedCase] = useState("title");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeStyle = CASE_STYLES.find((c) => c.id === selectedCase) || CASE_STYLES[0];

  // Convert active title
  const activeConverted = useMemo(() => {
    if (!title.trim()) return "";
    return activeStyle.convert(title);
  }, [title, activeStyle]);

  // Convert all formats
  const allFormats = useMemo(() => {
    if (!title.trim()) return [];
    return CASE_STYLES.map((style) => ({
      ...style,
      result: style.convert(title),
    }));
  }, [title]);

  const copyText = (textToCopy: string, id: string) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setTitle("");
  };

  const length = title.length;
  const isMobileOptimal = length > 0 && length <= 60;
  const isOver100 = length > 100;

  return (
    <div className="space-y-6">
      {/* Input Editor Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Type className="w-5 h-5 text-amber-500" />
              Capitalize My Title — Instant Case Converter
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Type or paste your video title below. Choose any format and copy instantly.
            </p>
          </div>
          {length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer text-muted-foreground self-end sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter or paste your YouTube title here (e.g. how i grew my channel from zero to 100k subscribers in 90 days)..."
            rows={3}
            className="w-full p-4 rounded-xl border border-border bg-background text-foreground text-base leading-relaxed outline-none focus:border-amber-500 transition-colors resize-none font-sans shadow-inner placeholder:text-muted-foreground/60"
            autoFocus
          />
          {length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer text-xs"
              title="Clear title"
            >
              ✕
            </button>
          )}
        </div>

        {/* Character count bar */}
        <div className="mt-3 flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-foreground">{length}</span>
            <span className="text-muted-foreground">/ 100 characters</span>
            {length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  isOver100
                    ? "bg-destructive/15 text-destructive"
                    : isMobileOptimal
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                }`}
              >
                {isOver100
                  ? "Exceeds 100 Chars"
                  : isMobileOptimal
                  ? "Mobile Optimal (<60 chars)"
                  : "Desktop Only (>60 chars)"}
              </span>
            )}
          </div>
          <span className="text-muted-foreground text-[11px] hidden sm:inline">
            YouTube title limit: 100 chars
          </span>
        </div>

        {/* Case Style Selector Pills */}
        <div className="mt-5 pt-4 border-t border-border/60">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
            Select Capitalization Style:
          </label>
          <div className="flex flex-wrap gap-2">
            {CASE_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelectedCase(style.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCase === style.id
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-[1.02]"
                    : "border border-border bg-muted/30 text-foreground hover:bg-accent"
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Preview Card */}
      <div className="rounded-2xl border-2 border-amber-500/30 bg-card p-4 sm:p-6 shadow-md relative overflow-hidden w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Converted Output
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                {activeStyle.name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeStyle.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => copyText(activeConverted, "main")}
            disabled={!title.trim()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors shadow-md disabled:opacity-40 cursor-pointer min-w-[130px] shrink-0"
          >
            {copiedId === "main" ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Title
              </>
            )}
          </button>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border/80 min-h-[72px] flex items-center w-full min-w-0 overflow-hidden">
          {activeConverted ? (
            <p className="text-lg sm:text-xl font-bold text-foreground leading-relaxed break-all sm:break-words [overflow-wrap:anywhere] select-all w-full min-w-0">
              {activeConverted}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Your converted title will appear here in real time as you type...
            </p>
          )}
        </div>
      </div>

      {/* All Available Formats Grid */}
      {allFormats.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-4 w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                All 11 Capitalization Variations
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click any copy button to immediately copy that specific case style:
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1 w-full min-w-0">
            {allFormats.map((fmt) => (
              <div
                key={fmt.id}
                className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-amber-500/50 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full min-w-0 overflow-hidden"
              >
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {fmt.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      ({fmt.result.length} chars)
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-foreground break-all sm:break-words [overflow-wrap:anywhere] select-all leading-relaxed">
                    {fmt.result}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {fmt.description}
                  </p>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => copyText(fmt.result, fmt.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent transition-colors shadow-sm cursor-pointer min-w-[85px]"
                  >
                    {copiedId === fmt.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
