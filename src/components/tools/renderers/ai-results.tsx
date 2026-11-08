"use client";

import { useState } from "react";
import { Copy, Check, Sparkles, HelpCircle, FileText, Share2, Volume2, TrendingUp, CheckCircle2 } from "lucide-react";

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

export function renderAIResults(toolId: string, data: Record<string, unknown>) {
  switch (toolId) {
    case "ai-title-generator": {
      const titles = (data.titles ?? []) as string[];
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Viral High-CTR Video Titles
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ranked by emotional hook, curiosity gap, and click-through probability.
              </p>
            </div>
            <CopyBtn text={titles.join("\n")} label="Copy All Titles" />
          </div>

          <div className="grid gap-3">
            {titles.map((title, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border/70 bg-muted/30 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">{title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {title.length} chars
                  </span>
                  <CopyBtn text={title} label="Copy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "ai-description-generator": {
      const description = String(data.description ?? "");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                SEO-Optimized Video Description
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Includes search hooks, timestamps layout, links template, and relevant tags.
              </p>
            </div>
            <CopyBtn text={description} label="Copy Description" />
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-muted/60 text-xs font-mono whitespace-pre-wrap border border-border max-h-96 overflow-y-auto leading-relaxed">
              {description}
            </pre>
          </div>
        </div>
      );
    }

    case "content-idea-generator":
    case "ai-video-idea-generator": {
      const ideas = (data.ideas ?? []) as Array<{
        title: string;
        hook?: string;
        format?: string;
        estimatedViews?: string;
        difficulty?: string;
      }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Viral Video Concepts & Formats
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Calculated viral angles based on current platform trend patterns.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {ideas.map((idea, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-border bg-muted/20 hover:border-primary/40 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {idea.format || "Standard Video"}
                    </span>
                    {idea.estimatedViews && (
                      <span className="text-[11px] font-bold text-emerald-500">
                        🔥 {idea.estimatedViews} views
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">{idea.title}</h4>
                  {idea.hook && (
                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                      &ldquo;{idea.hook}&rdquo;
                    </p>
                  )}
                </div>
                <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground">Difficulty: {idea.difficulty || "Medium"}</span>
                  <CopyBtn text={`${idea.title}\n\nHook: ${idea.hook || ""}`} label="Copy Concept" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "ai-chapter-generator": {
      const chapters = (data.chapters ?? []) as Array<{ timestamp: string; title: string }>;
      const rawText = chapters.map((c) => `${c.timestamp} ${c.title}`).join("\n");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg">Auto-Formatted Video Chapters</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Paste directly into your YouTube description to enable scrub bar timestamps.
              </p>
            </div>
            <CopyBtn text={rawText} label="Copy YouTube Chapters" />
          </div>

          <div className="divide-y divide-border/60 border border-border rounded-xl overflow-hidden">
            {chapters.map((ch, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                <span className="text-xs font-mono font-bold text-primary px-2 py-1 rounded bg-primary/10">
                  {ch.timestamp}
                </span>
                <span className="text-xs font-medium text-foreground flex-1 ml-3">{ch.title}</span>
                <CopyBtn text={`${ch.timestamp} ${ch.title}`} label="Copy" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "ai-cta-generator": {
      const ctas = (data.ctas ?? []) as Array<{ type: string; script: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Share2 className="w-5 h-5 text-rose-500" />
              High-Converting YouTube Call-to-Actions
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tested verbal hooks designed to boost subscribes, leads, and viewer retention.
            </p>
          </div>

          <div className="grid gap-3">
            {ctas.map((cta, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">{cta.type}</span>
                  <CopyBtn text={cta.script} label="Copy CTA" />
                </div>
                <p className="text-xs text-foreground/90 italic leading-relaxed">&ldquo;{cta.script}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "ai-community-post": {
      const posts = (data.posts ?? []) as Array<{
        type: string;
        text: string;
        options?: string[];
      }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Community Tab Engagement Posts</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Polls, behind-the-scenes teasers, and milestone giveaways to engage between uploads.
            </p>
          </div>

          <div className="grid gap-4">
            {posts.map((post, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                    {post.type}
                  </span>
                  <CopyBtn
                    text={post.options ? `${post.text}\n\nOptions:\n${post.options.map((o) => `• ${o}`).join("\n")}` : post.text}
                    label="Copy Post"
                  />
                </div>
                <p className="text-sm font-medium text-foreground whitespace-pre-line">{post.text}</p>
                {post.options && (
                  <div className="space-y-1.5 pt-1">
                    {post.options.map((opt, oIdx) => (
                      <div key={oIdx} className="px-3 py-2 rounded-lg border border-border/80 bg-background/60 text-xs font-medium">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "ai-pinned-comment": {
      const pinned = (data.pinnedComments ?? []) as Array<{ type: string; text: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Pinned Comment Engagement Boosters</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pinned comments double discussion rate and algorithm session watch time.
            </p>
          </div>

          <div className="grid gap-3">
            {pinned.map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">{item.type}</span>
                  <CopyBtn text={item.text} label="Copy Comment" />
                </div>
                <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "ai-storyline-outliner": {
      const acts = (data.acts ?? []) as Array<{ act: string; description: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">3-Act Documentary Storytelling Outline</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hollywood structure adapted for 70%+ retention on long-form YouTube videos.
            </p>
          </div>

          <div className="grid gap-3">
            {acts.map((act, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">{act.act}</span>
                  <CopyBtn text={`${act.act}\n${act.description}`} label="Copy Act" />
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{act.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "ai-trend-predictor": {
      const trends = (data.trends ?? []) as Array<{
        topic: string;
        momentum: string;
        potential: string;
        angle: string;
      }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Emerging YouTube Trend Predictions
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Topics surging in creator queries and viewer search momentum.
            </p>
          </div>

          <div className="grid gap-3">
            {trends.map((t, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{t.topic}</h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                    {t.momentum}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{t.angle}</p>
                <div className="text-[10px] font-bold text-primary uppercase">{t.potential}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "ai-video-summarizer": {
      const points = (data.summaryPoints ?? []) as string[];
      const actions = (data.actionItems ?? []) as string[];
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Executive Video Summary & Action Steps</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Key takeaways distilled for quick learning and implementation.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Key Insights
              </h4>
              <ul className="space-y-2">
                {points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {actions.length > 0 && (
              <div className="pt-3 border-t border-border/50">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2">
                  Actionable Checklist
                </h4>
                <ul className="space-y-2">
                  {actions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      );
    }

    case "ai-faq-generator": {
      const faqs = (data.faqs ?? []) as Array<{ q: string; a: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-500" />
                Frequently Asked Viewer Questions
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add to your description or video end to resolve viewer hesitation.
              </p>
            </div>
            <CopyBtn
              text={faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")}
              label="Copy All FAQs"
            />
          </div>

          <div className="grid gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 space-y-1.5">
                <h4 className="text-xs font-bold text-foreground">Q: {faq.q}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "ai-voiceover-script": {
      const narration = String(data.narration ?? "");
      const pace = String(data.readingPace ?? "140 WPM");
      const length = String(data.estimatedAudioLength ?? "1 min");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-indigo-500" />
                Voiceover Teleprompter Script
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Includes cadence marks, tonal cues, and estimated spoken duration.
              </p>
            </div>
            <CopyBtn text={narration} label="Copy Narration" />
          </div>

          <div className="flex gap-4 text-xs font-medium text-muted-foreground">
            <span>⏱️ Target Pace: <strong className="text-foreground">{pace}</strong></span>
            <span>🎙️ Duration: <strong className="text-foreground">{length}</strong></span>
          </div>

          <pre className="p-4 rounded-xl bg-muted/60 text-xs font-mono whitespace-pre-wrap border border-border leading-relaxed">
            {narration}
          </pre>
        </div>
      );
    }

    default:
      return null;
  }
}
