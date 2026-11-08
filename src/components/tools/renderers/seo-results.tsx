"use client";

import { useState } from "react";
import { Copy, Check, Hash, TrendingUp, Search, Calendar, BarChart2, CheckCircle2, AlertCircle, Video, FileText } from "lucide-react";

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent transition-colors shadow-sm cursor-pointer"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

export function renderSEOResults(toolId: string, data: Record<string, unknown>) {
  switch (toolId) {
    case "ai-hashtag-generator": {
      const hashtags = (data.hashtags ?? []) as string[];
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-500" />
                Trending Video Hashtags
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Top relevant hashtags to paste into your title or description.
              </p>
            </div>
            <CopyBtn text={hashtags.join(" ")} label="Copy All Hashtags" />
          </div>

          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag, i) => (
              <span
                key={i}
                onClick={() => navigator.clipboard.writeText(tag)}
                className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold cursor-pointer hover:bg-blue-500/20 transition-colors"
                title="Click to copy"
              >
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>
      );
    }

    case "competitor-tag-comparator": {
      const vidA = (data.videoA ?? {}) as { title?: string; tags?: string[] };
      const vidB = (data.videoB ?? {}) as { title?: string; tags?: string[] };
      const common = (data.commonTags ?? []) as string[];
      const uniqueA = (data.uniqueToA ?? []) as string[];
      const uniqueB = (data.uniqueToB ?? []) as string[];

      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Competitor Tag Comparison</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Identify shared ranking keywords and uncover missing keyword opportunities.
            </p>
          </div>

          {/* Overlap stats */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Shared Keywords ({common.length})
              </h4>
              {common.length > 0 && <CopyBtn text={common.join(", ")} label="Copy Shared" />}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {common.length > 0 ? (
                common.map((t, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No overlapping tags found.</span>
              )}
            </div>
          </div>

          {/* Side by side unique */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground truncate">{vidA.title || "Video 1"} ({uniqueA.length} Unique)</h4>
                {uniqueA.length > 0 && <CopyBtn text={uniqueA.join(", ")} label="Copy" />}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {uniqueA.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-muted text-foreground/80 text-[11px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground truncate">{vidB.title || "Video 2"} ({uniqueB.length} Unique)</h4>
                {uniqueB.length > 0 && <CopyBtn text={uniqueB.join(", ")} label="Copy" />}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {uniqueB.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-muted text-foreground/80 text-[11px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    case "youtube-rank-checker": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">YouTube Search Rank Analysis</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rank tracking for keyword: <strong className="text-foreground">&ldquo;{String(data.keyword ?? "")}&rdquo;</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-center">
              <div className="text-2xl font-bold text-primary">{String(data.currentRank ?? "#1")}</div>
              <div className="text-xs text-muted-foreground mt-1">Search Position</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
              <div className="text-2xl font-bold text-foreground">{String(data.totalCompetingVideos ?? "10,000+")}</div>
              <div className="text-xs text-muted-foreground mt-1">Competing Results</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center col-span-2 sm:col-span-1">
              <div className="text-2xl font-bold text-emerald-500">{String(data.searchVisibility ?? "High")}</div>
              <div className="text-xs text-muted-foreground mt-1">Search Visibility</div>
            </div>
          </div>
        </div>
      );
    }

    case "trending-topics-finder": {
      const categories = (data.categories ?? []) as Array<{ name: string; topics: string[] }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-500" />
              Real-Time Trending Creator Topics
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              High-velocity topics currently driving breakout searches on YouTube.
            </p>
          </div>

          <div className="grid gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary">{cat.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.topics.map((top, tIdx) => (
                    <span
                      key={tIdx}
                      onClick={() => navigator.clipboard.writeText(top)}
                      className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/40 text-xs font-medium cursor-pointer transition-colors"
                      title="Click to copy"
                    >
                      {top}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "channel-keywords-extractor": {
      const keywords = (((data.keywords || data.channelKeywords || []) as string[]).filter(Boolean));
      const channelTitle = String(data.channelTitle || "Creator Channel");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg">{channelTitle} — Channel Meta Keywords</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {keywords.length > 0
                  ? `${keywords.length} channel-level SEO keywords configured in YouTube Studio.`
                  : "No hidden channel keywords found for this creator."}
              </p>
            </div>
            {keywords.length > 0 && (
              <CopyBtn text={keywords.join(", ")} label="Copy All Keywords" />
            )}
          </div>

          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-border">
              This channel has not configured global channel-level keywords in YouTube Studio Settings &gt; Channel &gt; Basic Info.
            </div>
          )}
        </div>
      );
    }

    case "video-metadata-viewer": {
      const meta = (data.metadata ?? {}) as Record<string, unknown>;
      const snippet = (meta.snippet ?? {}) as Record<string, unknown>;
      const statistics = (meta.statistics ?? {}) as Record<string, unknown>;
      const rawJson = typeof data.rawJson === "string" ? data.rawJson : JSON.stringify(meta, null, 2);

      const title = String(snippet.title || meta.title || "YouTube Video");
      const channel = String(snippet.channelTitle || meta.author || "Creator");
      const id = String(meta.id || data.videoId || "");
      const views = statistics.viewCount || meta.views || "N/A";
      const published = String(snippet.publishedAt || meta.uploadDate || "N/A");
      const tags = Array.isArray(snippet.tags) ? (snippet.tags as string[]) : Array.isArray(meta.keywords) ? (meta.keywords as string[]) : [];

      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Channel: <span className="font-medium text-foreground">{channel}</span> • ID: <span className="font-mono">{id}</span>
              </p>
            </div>
            <CopyBtn text={rawJson} label="Copy Raw JSON" />
          </div>

          {/* Quick Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">Video ID</span>
              <span className="font-mono text-foreground font-semibold">{id}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">Total Views</span>
              <span className="font-mono text-foreground font-semibold">
                {typeof views === "number" ? views.toLocaleString() : Number(views) ? Number(views).toLocaleString() : String(views)}
              </span>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">Published</span>
              <span className="text-foreground font-medium">{published.split("T")[0]}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">Total Tags</span>
              <span className="text-foreground font-semibold">{tags.length} SEO Tags</span>
            </div>
          </div>

          {/* Tags List */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Extracted SEO Tags ({tags.length})</h4>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-3 rounded-xl border border-border bg-muted/10">
                {tags.map((t: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-medium text-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON Schema Inspector */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Raw JSON Metadata &amp; Schema</h4>
              <span className="text-[10px] text-muted-foreground font-mono">application/json</span>
            </div>
            <pre className="p-4 rounded-xl bg-muted/60 text-[11px] font-mono whitespace-pre-wrap max-h-72 overflow-y-auto border border-border leading-relaxed text-foreground/90">
              {rawJson}
            </pre>
          </div>
        </div>
      );
    }

    case "title-capitalizer": {
      const styles = [
        { label: "Title Case (Recommended)", value: String(data.titleCase ?? "") },
        { label: "ALL CAPS (High Intensity)", value: String(data.allCaps ?? "") },
        { label: "Bracket Style (CTR Booster)", value: String(data.bracketStyle ?? "") },
        { label: "Question / Curiosity Style", value: String(data.questionStyle ?? "") },
      ];
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Title Capitalization & Formatting</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Formats your video title into high-performing YouTube headline conventions.
            </p>
          </div>

          <div className="space-y-3">
            {styles.map((st, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase mb-0.5">{st.label}</div>
                  <div className="text-sm font-semibold text-foreground truncate">{st.value}</div>
                </div>
                <CopyBtn text={st.value} label="Copy" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "search-suggestion-scraper": {
      const suggestions = (data.suggestions ?? []) as string[];
      const query = String(data.query ?? "");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Live YouTube Search Autocomplete
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time search terms viewers are currently typing into YouTube search for &ldquo;{query}&rdquo;.
              </p>
            </div>
            <CopyBtn text={suggestions.join("\n")} label="Copy All Suggestions" />
          </div>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => navigator.clipboard.writeText(s)}
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:border-primary/40 cursor-pointer transition-colors text-xs font-medium"
              >
                <span className="truncate">{s}</span>
                <Copy className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "keyword-density-checker": {
      const density = (data.density ?? []) as Array<{ word: string; count: number; percentage: string; status?: "optimal" | "low" | "high" }>;
      const totalWords = Number(data.totalWords ?? 0);
      const videoTitle = data.videoTitle as string | undefined;
      const descriptionPreview = data.descriptionPreview as string | undefined;

      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="pb-3 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-lg">Description Keyword Density</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Target 1.5% – 3.5% density per primary keyword to avoid keyword stuffing penalties.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-muted border border-border/50 text-foreground">
                Total Words: {totalWords}
              </span>
            </div>
          </div>

          {videoTitle && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
              <Video className="w-4 h-4 text-red-500 shrink-0" />
              <div className="truncate">
                <span className="text-muted-foreground mr-1">Analyzed Video:</span>
                <span className="font-semibold text-foreground">{videoTitle}</span>
              </div>
            </div>
          )}

          {descriptionPreview && (
            <div className="p-3.5 rounded-xl bg-muted/20 border border-border/40 text-xs space-y-1">
              <div className="font-semibold text-[11px] text-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                Analyzed Description Excerpt:
              </div>
              <p className="line-clamp-3 italic text-[11px] text-foreground/80 leading-relaxed">
                &ldquo;{descriptionPreview}&rdquo;
              </p>
            </div>
          )}

          {density.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-border">
              No significant recurring keywords detected.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {density.map((item, i) => {
                const isOptimal = item.status === "optimal" || (!item.status && parseFloat(item.percentage) >= 1.5 && parseFloat(item.percentage) <= 3.5);
                const isHigh = item.status === "high" || (!item.status && parseFloat(item.percentage) > 3.5);

                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-1 mb-2">
                      <div className="font-bold text-sm text-foreground truncate capitalize">
                        {item.word}
                      </div>
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                          isOptimal
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : isHigh
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isOptimal ? "Optimal" : isHigh ? "High" : "Low"}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-auto pt-2 border-t border-border/40">
                      <span className="text-sm font-black text-primary">{item.percentage}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {item.count} {item.count === 1 ? "occurrence" : "occurrences"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-muted-foreground border-t border-border/40">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Optimal (1.5% – 3.5%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> High / Overstuffed (&gt;3.5%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted-foreground"></span> Low (&lt;1.5%)
            </span>
          </div>
        </div>
      );
    }

    case "ai-seo-optimizer": {
      const overall = Number(data.overallScore ?? 85);
      const items = (data.checklist ?? []) as Array<{ name: string; score: number; tip: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Complete YouTube SEO Audit</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automated algorithmic audit across title, description, tags, and thumbnails.
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-500">{overall}/100</span>
              <span className="text-[10px] block text-muted-foreground uppercase">SEO Score</span>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    {item.score >= 80 ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                    {item.name} ({item.score}/100)
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "upload-date-finder":
    case "video-age-calculator": {
      const videoTitle = data.videoTitle as string | undefined;
      const channelTitle = data.channelTitle as string | undefined;
      const utcTimestamp = String(data.utcTimestamp || data.exactIso || "");

      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Exact Upload Timestamp & Age Calculator
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Uncovers exact second, UTC timestamp, and cumulative age of the video.
              </p>
            </div>
            {utcTimestamp && (
              <CopyBtn text={utcTimestamp} label="Copy ISO Timestamp" />
            )}
          </div>

          {videoTitle && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
              <Video className="w-4 h-4 text-red-500 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-foreground">{videoTitle}</span>
                {channelTitle && <span className="text-muted-foreground ml-1.5">• {channelTitle}</span>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
              <div className="text-sm font-bold text-foreground">{String(data.publishedAtFormatted ?? "Unknown")}</div>
              <div className="text-[11px] text-muted-foreground mt-1">Exact Publication Time</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
              <div className="text-2xl font-black text-primary">{String(data.elapsedDays ?? 0)} days</div>
              <div className="text-[11px] text-muted-foreground mt-1">Total Days Live</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
              <div className="text-sm font-bold text-emerald-500">{String(data.ageSummary ?? "")}</div>
              <div className="text-[11px] text-muted-foreground mt-1">Elapsed Time</div>
            </div>
          </div>

          {utcTimestamp && (
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-muted/20 border border-border/40 text-xs font-mono text-muted-foreground">
              <span>Raw UTC: <strong className="text-foreground">{utcTimestamp}</strong></span>
            </div>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}
