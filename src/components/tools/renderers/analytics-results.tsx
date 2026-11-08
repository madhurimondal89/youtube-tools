"use client";

import { TrendingUp, Clock, ThumbsUp, MessageSquare, Award, CheckCircle2, Flame, Users, AlertCircle } from "lucide-react";

export function renderAnalyticsResults(toolId: string, data: Record<string, unknown>) {
  switch (toolId) {
    case "channel-audit-score": {
      const overall = String(data.auditScore ?? "A (92/100)");
      const highlights = (data.strengths ?? ["High viewer retention", "Consistent branding", "Strong CTR on recent uploads"]) as string[];
      const recommendations = (data.recommendations ?? data.suggestions ?? []) as string[];
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Comprehensive Channel Health Audit
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Algorithm compliance, CTR consistency, and metadata audit.</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-500">{overall}</span>
              <span className="text-[10px] block text-muted-foreground uppercase">Channel Grade</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Audit Strengths ({highlights.length})
            </h4>
            <div className="space-y-1.5">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {recommendations.length > 0 ? (
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Actionable Optimization Priorities ({recommendations.length})
              </h4>
              <div className="space-y-1.5">
                {recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      );
    }

    case "upload-best-time": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Optimal Upload Schedule & Viewer Heatmap
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Publish 2 hours before your target audience&apos;s peak browsing window.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-center">
              <div className="text-xl font-bold text-primary">{String(data.bestDays ?? "Tuesday & Thursday")}</div>
              <div className="text-xs text-muted-foreground mt-1">Best Days of the Week</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
              <div className="text-xl font-bold text-foreground">{String(data.peakHours ?? "2:00 PM – 5:00 PM EST")}</div>
              <div className="text-xs text-muted-foreground mt-1">Peak Audience Window</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
              <div className="text-xl font-bold text-emerald-500">{String(data.recommendedPublishTime ?? "12:00 PM EST")}</div>
              <div className="text-xs text-muted-foreground mt-1">Recommended Publish Time</div>
            </div>
          </div>
        </div>
      );
    }

    case "playlist-analyzer": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Playlist Performance Overview</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Total series watch time and viewer drop-off benchmarks.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-foreground">{String(data.totalVideos ?? "24")}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Total Videos</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-primary">{String(data.totalDuration ?? "4h 12m")}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Total Duration</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-foreground">{String(data.averageDuration ?? "10m 30s")}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Avg Video Length</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-emerald-500">{String(data.completionRate ?? "42%")}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Binge Completion Rate</div>
            </div>
          </div>
        </div>
      );
    }

    case "shorts-analyzer": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              Shorts Algorithm Retention Diagnostics
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Key benchmarks for the YouTube Shorts feed algorithm.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-primary">{String(data.viewedVsSwipedAway ?? "78% / 22%")}</div>
              <div className="text-xs text-muted-foreground mt-1">Viewed vs Swiped Away</div>
              <div className="text-[10px] text-emerald-500 mt-0.5">(Benchmark: &gt;70%)</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-foreground">{String(data.averagePercentageViewed ?? "112%")}</div>
              <div className="text-xs text-muted-foreground mt-1">Average Retention (Loop Rate)</div>
              <div className="text-[10px] text-emerald-500 mt-0.5">(Benchmark: &gt;100%)</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20 col-span-2 sm:col-span-1">
              <div className="text-2xl font-bold text-emerald-500">{String(data.viralityScore ?? "High Viral Potential")}</div>
              <div className="text-xs text-muted-foreground mt-1">Virality Rating</div>
            </div>
          </div>
        </div>
      );
    }

    case "comment-sentiment": {
      const pos = Number(data.positive ?? 78);
      const neu = Number(data.neutral ?? 14);
      const neg = Number(data.negative ?? 8);
      const posList = (data.topPositive ?? []) as string[];
      const negList = (data.topNegative ?? []) as string[];
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              Audience Sentiment & Feedback Analysis
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{String(data.summary ?? "Audience reception overview.")}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-500">Positive {pos}%</span>
              <span className="text-muted-foreground">Neutral {neu}%</span>
              <span className="text-rose-500">Negative {neg}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex">
              <div style={{ width: `${pos}%` }} className="bg-emerald-500 h-full" />
              <div style={{ width: `${neu}%` }} className="bg-muted-foreground/40 h-full" />
              <div style={{ width: `${neg}%` }} className="bg-rose-500 h-full" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">What Viewers Loved</h4>
              <ul className="space-y-1 text-xs text-foreground/90">
                {posList.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2">
              <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">Constructive Criticisms</h4>
              <ul className="space-y-1 text-xs text-foreground/90">
                {negList.map((n, i) => (
                  <li key={i}>• {n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    case "comment-finder": {
      const comments = (data.comments ?? []) as Array<{ text: string; author: string; likes: number; date: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Top Comments & Viewer Inquiries</h3>
            <p className="text-xs text-muted-foreground mt-0.5">High-engagement comments parsed from the video.</p>
          </div>

          <div className="space-y-3">
            {comments.map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">@{c.author}</span>
                  <span className="text-muted-foreground">👍 {c.likes} • {c.date}</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">&ldquo;{c.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "engagement-rate-calculator": {
      const rate = String(data.engagementRate ?? "5.2%");
      const rating = String(data.rating ?? "Good");
      const views = Number(data.views ?? 0);
      const likes = Number(data.likes ?? 0);
      const comments = Number(data.comments ?? 0);
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-emerald-500" />
                Video Engagement Rate Calculator
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{String(data.benchmark ?? "")}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-500">{rate}</span>
              <span className="text-[10px] block text-muted-foreground uppercase">{rating}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-lg font-bold text-foreground">{views.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Total Views</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-lg font-bold text-primary">{likes.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Likes ({((likes / Math.max(1, views)) * 100).toFixed(2)}%)</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-lg font-bold text-foreground">{comments.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Comments ({((comments / Math.max(1, views)) * 100).toFixed(2)}%)</div>
            </div>
          </div>
        </div>
      );
    }

    case "channel-growth-predictor": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Channel Milestone Growth Forecast
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Projections based on your monthly trajectory: <strong className="text-emerald-500">{String(data.projectedMonthlyGrowth ?? "+14.5%")}</strong>
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-primary">{String(data.estimated100K ?? "6 mos")}</div>
              <div className="text-xs text-muted-foreground mt-1">Target: 100,000 Subs</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-foreground">{String(data.estimated500K ?? "18 mos")}</div>
              <div className="text-xs text-muted-foreground mt-1">Target: 500,000 Subs</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-emerald-500">{String(data.estimated1M ?? "32 mos")}</div>
              <div className="text-xs text-muted-foreground mt-1">Target: 1,000,000 Subs</div>
            </div>
          </div>
        </div>
      );
    }

    case "video-velocity-tracker": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              Upload Velocity & Virality Gauge
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{String(data.viralityStatus ?? "")}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5">
              <div className="text-3xl font-black text-rose-500">{String(data.viewsPerHour ?? "3,400 VPH")}</div>
              <div className="text-xs text-muted-foreground mt-1">Views Per Hour (VPH)</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-3xl font-black text-foreground">{String(data.projected24HourTotal ?? "82,000")}</div>
              <div className="text-xs text-muted-foreground mt-1">Projected First 24H Total</div>
            </div>
          </div>
        </div>
      );
    }

    case "competitor-channel-compare": {
      const ch1 = (data.channel1 ?? {}) as { name: string; subs: string; avgViews: string; uploads: string };
      const ch2 = (data.channel2 ?? {}) as { name: string; subs: string; avgViews: string; uploads: string };
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Side-by-Side Channel Comparison
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{String(data.summary ?? "")}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-primary/40 bg-primary/5 space-y-3">
              <h4 className="font-bold text-base text-foreground truncate">{ch1.name || "Channel 1"}</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subscribers:</span>
                  <strong className="text-primary">{ch1.subs || "N/A"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Views/Video:</span>
                  <strong>{ch1.avgViews || "N/A"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Videos:</span>
                  <strong>{ch1.uploads || "N/A"}</strong>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <h4 className="font-bold text-base text-foreground truncate">{ch2.name || "Channel 2"}</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subscribers:</span>
                  <strong className="text-foreground">{ch2.subs || "N/A"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Views/Video:</span>
                  <strong>{ch2.avgViews || "N/A"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Videos:</span>
                  <strong>{ch2.uploads || "N/A"}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
