"use client";

import { motion } from "framer-motion";
import {
  Copy,
  Download,
  ExternalLink,
  Check,
  Play,
  Sparkles,
  Award,
  Video,
  Music,
  Share2,
  Sliders,
  CheckCircle2,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  ShieldCheck,
  Gift,
  Tv,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import type { Tool } from "@/lib/tools-registry";
import Image from "next/image";
import { renderAIResults } from "./renderers/ai-results";
import { renderSEOResults } from "./renderers/seo-results";
import { renderVisualResults } from "./renderers/visual-results";
import { renderAnalyticsResults } from "./renderers/analytics-results";
import { renderCalculatorResults } from "./renderers/calculator-results";
import { renderProductivityResults } from "./renderers/productivity-results";

interface ToolResultProps {
  tool: Tool;
  data: Record<string, unknown>;
}

export function ToolResult({ tool, data }: ToolResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {renderResult(tool.id, data)}
    </motion.div>
  );
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent transition-colors shadow-sm"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

function ResultCard({
  title,
  children,
  action,
  subtitle,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-border/60">
        <div>
          <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
          {subtitle ? <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p> : null}
        </div>
        {action ? action : null}
      </div>
      {children}
    </div>
  );
}

function StatGrid({
  stats,
}: {
  stats: Array<{ label: string; value: string | number; color?: string; sublabel?: string }>;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border/50 bg-muted/40 p-3.5 text-center">
          <div className="text-xl sm:text-2xl font-bold" style={s.color ? { color: s.color } : undefined}>
            {s.value}
          </div>
          <div className="text-xs font-medium text-foreground/80 mt-1">{s.label}</div>
          {s.sublabel ? <div className="text-[10px] text-muted-foreground mt-0.5">{s.sublabel}</div> : null}
        </div>
      ))}
    </div>
  );
}

function TagsCloud({ tags }: { tags: string[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{tags.length} tags found</span>
        <CopyButton text={tags.join(", ")} label="Copy All Tags" />
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => navigator.clipboard.writeText(tag)}
            title="Click to copy"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function downloadImageDirect(imageUrl: string, filename: string) {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(imageUrl, "_blank");
  }
}

function MediaDownloadButton({
  url,
  label = "Download",
  filename,
  isAudio = false,
}: {
  url: string;
  label?: string;
  filename: string;
  isAudio?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDownload = async () => {
    try {
      setStatus("loading");
      setErrorMessage("");

      const res = await fetch(url);
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || `HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      setStatus("done");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.warn("Download error:", err);
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Download failed");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDownload}
        disabled={status === "loading"}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow transition-all cursor-pointer ${
          status === "loading"
            ? "bg-primary/80 text-primary-foreground opacity-90 cursor-wait"
            : status === "done"
            ? "bg-emerald-600 text-white"
            : status === "error"
            ? "bg-rose-600 text-white"
            : isAudio
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "bg-primary text-primary-foreground hover:opacity-90"
        }`}
      >
        {status === "loading" ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{isAudio ? "Converting 320kbps MP3..." : "Merging HD Video & Audio..."}</span>
          </>
        ) : status === "done" ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Downloaded!</span>
          </>
        ) : status === "error" ? (
          <>
            <span>Retry Download</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            <span>{label}</span>
          </>
        )}
      </button>
      {status === "error" && errorMessage ? (
        <span className="text-[10px] text-rose-400 font-medium">{errorMessage}</span>
      ) : null}
    </div>
  );
}

function renderResult(toolId: string, data: Record<string, unknown>) {
  // Check specialized modular category renderers first
  const ai = renderAIResults(toolId, data);
  if (ai) return ai;

  const seo = renderSEOResults(toolId, data);
  if (seo) return seo;

  const visual = renderVisualResults(toolId, data);
  if (visual) return visual;

  const analytics = renderAnalyticsResults(toolId, data);
  if (analytics) return analytics;

  const calc = renderCalculatorResults(toolId, data);
  if (calc) return calc;

  const prod = renderProductivityResults(toolId, data);
  if (prod) return prod;

  switch (toolId) {
    // ══════════════════════════════════════════════════════════════════
    // 1. DOWNLOAD & MEDIA
    // ══════════════════════════════════════════════════════════════════
    case "youtube-video-downloader":
    case "shorts-downloader": {
      const videoId = String(data.videoId || "dQw4w9WgXcQ");
      const formats = Array.isArray(data.formats)
        ? (data.formats as Array<{
            quality: string;
            resolution: string;
            format: string;
            size: string;
            hasAudio: boolean;
            recommended?: boolean;
            downloadUrl: string;
          }>)
        : [];
      return (
        <div className="space-y-6">
          <ResultCard
            title={String(data.title ?? "YouTube Video")}
            subtitle={`Channel: ${String(data.channel ?? "Creator")} • Duration: ${String(data.duration ?? "")}`}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-72 aspect-video rounded-xl overflow-hidden bg-black/50 border border-border shrink-0">
                <Image
                  src={String(data.thumbnailUrl ?? "")}
                  alt={String(data.title ?? "Video")}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex items-end p-3">
                  <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-semibold text-white">
                    {String(data.duration ?? "HD")}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Select Format & Quality:</h4>
                <div className="space-y-2">
                  {formats.map((fmt, idx) => {
                    const qualityParam = fmt.quality.includes("2160") || fmt.quality.includes("4K")
                      ? "2160"
                      : fmt.quality.includes("1080")
                      ? "1080"
                      : fmt.quality.includes("720")
                      ? "720"
                      : "480";
                    const isAudioOnly = fmt.format === "MP3" || fmt.format === "M4A" || fmt.resolution.toLowerCase().includes("audio");
                    const audioExt = fmt.format.toLowerCase() === "m4a" ? "m4a" : "mp3";
                    const dlUrl = `/api/download?v=${videoId}&quality=${qualityParam}${isAudioOnly ? `&audio=true&format=${audioExt}` : ""}`;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          fmt.recommended
                            ? "border-primary/50 bg-primary/5 shadow-sm"
                            : "border-border bg-card/60 hover:bg-accent/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="p-2 rounded-lg bg-muted">
                            {isAudioOnly ? <Music className="w-4 h-4 text-purple-500" /> : <Video className="w-4 h-4 text-red-500" />}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{fmt.quality}</span>
                              {fmt.recommended ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                  RECOMMENDED
                                </span>
                              ) : null}
                            </div>
                            <span className="text-xs text-muted-foreground">{fmt.resolution} • {fmt.size} • {fmt.format}</span>
                          </div>
                        </div>
                        <MediaDownloadButton
                          url={dlUrl}
                          label="Download"
                          isAudio={isAudioOnly}
                          filename={`${videoId}_${isAudioOnly ? "audio" : qualityParam}.${isAudioOnly ? audioExt : "mp4"}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ResultCard>
        </div>
      );
    }

    case "audio-extractor":
    case "audio-track-downloader":
    case "shorts-audio-picker": {
      const videoId = String(data.videoId || "dQw4w9WgXcQ");
      const audioFormats = Array.isArray(data.audioFormats)
        ? (data.audioFormats as Array<{
            format: string;
            bitrate: string;
            size: string;
            recommended?: boolean;
          }>)
        : [];
      return (
        <ResultCard
          title={String(data.title ?? "Extracted Audio Track")}
          subtitle={`Artist / Channel: ${String(data.channel ?? "")}`}
        >
          <div className="space-y-3">
            {audioFormats.map((af, i) => {
              const isM4A = af.format.includes("M4A") || af.format.includes("AAC");
              const ext = isM4A ? "m4a" : "mp3";
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-medium text-sm">{af.format}</span>
                      <div className="text-xs text-muted-foreground">Bitrate: {af.bitrate} • Est. Size: {af.size}</div>
                    </div>
                  </div>
                  <MediaDownloadButton
                    url={`/api/download?v=${videoId}&audio=true&format=${ext}`}
                    label={`Download ${ext.toUpperCase()}`}
                    isAudio={true}
                    filename={`${videoId}_audio.${ext}`}
                  />
                </div>
              );
            })}
          </div>
        </ResultCard>
      );
    }

    case "thumbnail-downloader": {
      const videoId = String(data.videoId || "video");
      const thumbnails = Array.isArray(data.thumbnails)
        ? (data.thumbnails as Array<{
            label: string;
            url: string;
            quality: string;
            badge?: string;
          }>)
        : [];
      return (
        <div className="space-y-4">
          <ResultCard title="Available High Resolution Thumbnails">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {thumbnails.map((thumb, idx) => (
                <div key={idx} className="rounded-xl border border-border p-3 space-y-3 bg-card/60">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40">
                    <Image src={thumb.url} alt={thumb.label} fill className="object-cover" unoptimized />
                    {thumb.badge ? (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600 text-[10px] font-bold text-white shadow">
                        {thumb.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs">{thumb.label}</div>
                      <div className="text-[11px] text-muted-foreground">{thumb.quality}</div>
                    </div>
                    <button
                      onClick={() => downloadImageDirect(thumb.url, `thumbnail-${videoId}-${idx + 1}.jpg`)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold cursor-pointer hover:opacity-90"
                    >
                      <Download className="w-3 h-3" /> Save HD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </ResultCard>
        </div>
      );
    }

    case "subtitle-downloader":
    case "transcript-downloader": {
      const videoId = String(data.videoId || "video");
      const sampleSrt = String(data.sampleSrt ?? "");
      const sampleVtt = String(data.sampleVtt ?? "");
      const sampleTxt = String(data.sampleTxt ?? "");
      const noCaptions = Boolean(data.noCaptions || !sampleSrt);
      const totalLines = Number(data.totalLines || 0);
      const availableLanguages = Array.isArray(data.availableLanguages)
        ? (data.availableLanguages as Array<{ language: string; name: string; kind?: string }>)
        : [];

      if (noCaptions) {
        return (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">No Subtitles Found</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This video does not have closed captions or auto-generated transcripts available on YouTube.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground/80 pl-11">
              Tip: YouTube only generates auto-subtitles for supported languages with clear audio. Videos with background music only, Shorts without dialogue, or creator-restricted captions will not have timed text.
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <ResultCard
            title="Video Transcript & Subtitles"
            action={<CopyButton text={sampleSrt} label="Copy SRT Format" />}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex flex-wrap items-center gap-2">
                  {totalLines > 0 && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {totalLines} Subtitle Cues
                    </span>
                  )}
                  {availableLanguages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
                    >
                      {lang.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => downloadTextFile(sampleSrt, `subtitles-${videoId}.srt`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download .SRT
                </button>
                <button
                  onClick={() => downloadTextFile(sampleVtt, `subtitles-${videoId}.vtt`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download .VTT
                </button>
                <button
                  onClick={() => downloadTextFile(sampleTxt, `transcript-${videoId}.txt`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-semibold hover:bg-accent cursor-pointer shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download .TXT
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-muted/60 text-xs font-mono whitespace-pre-wrap max-h-80 overflow-y-auto border border-border leading-relaxed">
                {sampleSrt}
              </pre>
            </div>
          </ResultCard>
        </div>
      );
    }

    // ══════════════════════════════════════════════════════════════════
    // 2. AI SCRIPT & CONTENT
    // ══════════════════════════════════════════════════════════════════
    case "ai-script-writer": {
      const hook = (data.hook ?? {}) as Record<string, string>;
      const intro = (data.intro ?? {}) as Record<string, string>;
      const sections = Array.isArray(data.sections)
        ? (data.sections as Array<{
            heading: string;
            timestamp: string;
            spoken: string;
            visualCue: string;
            bRollSuggestion: string;
          }>)
        : [];
      const cta = (data.callToAction ?? {}) as Record<string, string>;
      const outro = (data.outro ?? {}) as Record<string, string>;

      return (
        <div className="space-y-6">
          <ResultCard
            title={String(data.title ?? "Complete YouTube Video Script")}
            subtitle={`Target Length: ${String(data.targetDuration ?? "8-10 Min")} • ~${Number(data.wordCount ?? 1200)} Words`}
            action={<CopyButton text={JSON.stringify(data, null, 2)} label="Copy Full Script" />}
          >
            <div className="space-y-4">
              {/* Hook Box */}
              <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4" /> First 15 Seconds Hook
                </div>
                <p className="text-sm font-medium text-foreground">{hook.spoken}</p>
                <p className="text-xs text-muted-foreground italic">🎬 Visual Direction: {hook.visual}</p>
              </div>

              {/* Intro Box */}
              <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <Play className="w-4 h-4" /> Intro & Value Promise
                </div>
                <p className="text-sm font-medium text-foreground">{intro.spoken}</p>
                <p className="text-xs text-muted-foreground italic">🎬 Visual Direction: {intro.visual}</p>
              </div>

              {/* Sections */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Main Content Sections</h4>
                {sections.map((sec, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-foreground">{sec.heading}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-muted font-mono">{sec.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{sec.spoken}</p>
                    <div className="pt-2 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>🎥 Cue: <span className="text-foreground/80">{sec.visualCue}</span></div>
                      <div>🎞️ B-Roll: <span className="text-foreground/80">{sec.bRollSuggestion}</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to action */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Call to Action (CTA) & Outro
                </div>
                <p className="text-sm font-medium">{cta.spoken}</p>
                <p className="text-xs text-muted-foreground">{outro.spoken}</p>
              </div>
            </div>
          </ResultCard>
        </div>
      );
    }

    case "ai-shorts-script": {
      const pacing = Array.isArray(data.storyPacing)
        ? (data.storyPacing as Array<{
            secondMark: string;
            narration: string;
            screenAction: string;
            soundEffect: string;
          }>)
        : [];
      return (
        <ResultCard
          title={String(data.title ?? "Viral Shorts Script")}
          subtitle={`Duration: ${Number(data.durationSeconds ?? 45)}s Vertical Fast Paced`}
          action={<CopyButton text={JSON.stringify(data, null, 2)} label="Copy Shorts Script" />}
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5">
              <span className="text-xs font-bold text-rose-400 uppercase">⚡ 3-Second Scroll Stopper:</span>
              <p className="text-sm font-semibold mt-1">{String(data.hook ?? "")}</p>
            </div>

            <div className="space-y-2.5">
              {pacing.map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border bg-card/60 flex flex-col sm:flex-row gap-3">
                  <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono font-bold shrink-0 self-start">
                    {step.secondMark}
                  </span>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{step.narration}</p>
                    <div className="text-xs text-muted-foreground flex gap-4">
                      <span>🎬 {step.screenAction}</span>
                      <span>🔊 {step.soundEffect}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-muted/60 text-xs flex justify-between items-center">
              <span>🔄 Loop Ending: <strong>{String(data.loopEnding ?? "")}</strong></span>
              <span className="text-primary font-mono">{Array.isArray(data.hashtags) ? (data.hashtags as string[]).join(" ") : ""}</span>
            </div>
          </div>
        </ResultCard>
      );
    }

    case "ai-hook-generator": {
      const hooks = Array.isArray(data.hooks)
        ? (data.hooks as Array<{
            type: string;
            hookText: string;
            visualAction: string;
            whyItWorks: string;
          }>)
        : [];
      return (
        <ResultCard title="Viral 5-Second Video Hooks">
          <div className="space-y-3">
            {hooks.map((h, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-card/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {h.type}
                  </span>
                  <CopyButton text={h.hookText} />
                </div>
                <p className="text-sm font-bold text-foreground">&ldquo;{h.hookText}&rdquo;</p>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>🎬 Visual Cue: {h.visualAction}</p>
                  <p>🧠 Psychological Trigger: {h.whyItWorks}</p>
                </div>
              </div>
            ))}
          </div>
        </ResultCard>
      );
    }

    case "ai-repurpose-script":
    case "video-clip-cutter": {
      const videoId = String(data.videoId || "");
      const shorts = Array.isArray(data.shorts || data.clips)
        ? ((data.shorts || data.clips) as Array<{
            clipNumber?: number;
            title?: string;
            startSec?: number;
            endSec?: number;
            timestamp?: string;
            durationFormatted?: string;
            hook: string;
            takeaway: string;
            script: string;
            callToAction?: string;
            viralityScore?: number;
          }>)
        : [];

      return (
        <div className="space-y-4">
          <ResultCard
            title={String(data.title ? `Viral Clips & Shorts: "${data.title}"` : "Auto-Extracted Viral Shorts & Clips")}
            subtitle="AI-detected highest retention segments ready to export in 9:16 vertical Shorts and 16:9 HD formats."
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {shorts.map((s, i) => {
                const clipNum = s.clipNumber ?? i + 1;
                const startSec = s.startSec ?? 15 + i * 45;
                const endSec = s.endSec ?? startSec + 45;
                const score = s.viralityScore ?? Math.max(85, 96 - i * 3);
                const timeRange = s.timestamp || `${Math.floor(startSec / 60)}:${(startSec % 60).toString().padStart(2, "0")} - ${Math.floor(endSec / 60)}:${(endSec % 60).toString().padStart(2, "0")}`;
                const vertDlUrl = `/api/clip-download?v=${videoId || "dQw4w9WgXcQ"}&start=${startSec}&end=${endSec}&vertical=true`;
                const hdDlUrl = `/api/clip-download?v=${videoId || "dQw4w9WgXcQ"}&start=${startSec}&end=${endSec}&vertical=false`;

                return (
                  <div key={i} className="p-4 rounded-xl border border-border bg-card/70 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                            Clip #{clipNum}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-muted font-mono font-medium">
                            ⏱️ {timeRange}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          🔥 {score}% Virality Score
                        </span>
                      </div>

                      {s.title ? <h4 className="font-semibold text-sm text-foreground">{s.title}</h4> : null}
                      
                      <div className="p-2.5 rounded-lg bg-muted/50 border border-border/50 text-xs">
                        <span className="font-bold text-primary">🎯 3-Sec Hook: </span>
                        <span className="text-foreground/90">{s.hook}</span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {s.script}
                      </p>

                      {s.takeaway ? (
                        <div className="text-[11px] text-emerald-400 font-medium">
                          💡 Key Takeaway: {s.takeaway}
                        </div>
                      ) : null}
                    </div>

                    <div className="pt-2 border-t border-border/50 space-y-2">
                      {videoId ? (
                        <div className="flex flex-wrap gap-2 items-center">
                          <MediaDownloadButton
                            url={vertDlUrl}
                            label="Download 9:16 Short (MP4)"
                            filename={`${videoId}_short_${clipNum}_9x16.mp4`}
                          />
                          <MediaDownloadButton
                            url={hdDlUrl}
                            label="Download 16:9 Clip"
                            filename={`${videoId}_clip_${clipNum}_16x9.mp4`}
                          />
                          <CopyButton text={s.script} label="Copy Script" />
                        </div>
                      ) : (
                        <CopyButton text={s.script} label="Copy Script" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ResultCard>
        </div>
      );
    }

    case "ai-sponsorship-pitch": {
      const subjects = Array.isArray(data.subjectLines) ? (data.subjectLines as string[]) : [];
      const deliverables = Array.isArray(data.deliverablesList) ? (data.deliverablesList as string[]) : [];
      return (
        <div className="space-y-4">
          <ResultCard
            title="Sponsorship Pitch Email & Media Kit"
            action={<CopyButton text={String(data.emailBody ?? "")} label="Copy Email Pitch" />}
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Recommended Subject Lines:</h4>
                <div className="space-y-1">
                  {subjects.map((sub, i) => (
                    <div key={i} className="p-2 rounded-lg bg-muted text-xs font-medium flex justify-between items-center">
                      <span>{sub}</span>
                      <CopyButton text={sub} label="Copy" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Email Body:</h4>
                <pre className="p-4 rounded-xl bg-muted/60 text-xs font-sans whitespace-pre-wrap leading-relaxed border border-border">
                  {String(data.emailBody ?? "")}
                </pre>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex justify-between items-center text-xs">
                <span>Suggested Rate: <strong>{String(data.rateCardSuggestion ?? "")}</strong></span>
                <span>{deliverables.length} Deliverables Included</span>
              </div>
            </div>
          </ResultCard>
        </div>
      );
    }

    case "ai-multilingual-translator": {
      const trans = Array.isArray(data.translations)
        ? (data.translations as Array<{
            language: string;
            flag: string;
            translatedTitle: string;
            translatedDescription: string;
          }>)
        : [];
      return (
        <ResultCard title="Multilingual Titles & Descriptions">
          <div className="space-y-3">
            {trans.map((t, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-border bg-card/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{t.flag} {t.language}</span>
                  <CopyButton text={`${t.translatedTitle}\n\n${t.translatedDescription}`} />
                </div>
                <div className="text-xs font-semibold text-foreground">{t.translatedTitle}</div>
                <div className="text-xs text-muted-foreground">{t.translatedDescription}</div>
              </div>
            ))}
          </div>
        </ResultCard>
      );
    }

    // ══════════════════════════════════════════════════════════════════
    // 3. SEO, RANKING & KEYWORDS
    // ══════════════════════════════════════════════════════════════════
    case "tags-extractor":
    case "keyword-extractor":
    case "ai-tags-generator": {
      const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
      return (
        <ResultCard title="Extracted SEO Tags & Keywords">
          <TagsCloud tags={tags} />
        </ResultCard>
      );
    }

    case "keyword-research": {
      const related = Array.isArray(data.relatedKeywords)
        ? (data.relatedKeywords as Array<{ keyword: string; volume: string; competition: string }>)
        : [];
      return (
        <div className="space-y-4">
          <ResultCard title={`Keyword Analysis: "${String(data.keyword ?? "")}"`}>
            <StatGrid
              stats={[
                { label: "Search Volume", value: String(data.searchVolume ?? ""), color: "#3b82f6" },
                { label: "Competition", value: String(data.competition ?? ""), color: "#f59e0b" },
                { label: "Opportunity Score", value: String(data.overallScore ?? "80/100"), color: "#10b981" },
              ]}
            />
            <div className="mt-6 space-y-2">
              <h4 className="text-xs font-bold uppercase text-muted-foreground">High-Volume Long Tail Keywords:</h4>
              {related.map((rk, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card text-xs">
                  <span className="font-medium">{rk.keyword}</span>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span>{rk.volume} / mo</span>
                    <span className="px-2 py-0.5 rounded bg-muted">{rk.competition}</span>
                    <CopyButton text={rk.keyword} />
                  </div>
                </div>
              ))}
            </div>
          </ResultCard>
        </div>
      );
    }

    case "seo-score-checker": {
      const checklist = Array.isArray(data.checklist)
        ? (data.checklist as Array<{ label: string; passed: boolean; tip: string; points?: number; maxPoints?: number }>)
        : [];
      const score = Math.min(100, Math.max(0, Number(data.score ?? 70)));
      const passedCount = checklist.filter((c) => c.passed).length;

      return (
        <ResultCard
          title="100-Point YouTube Video SEO Audit"
          subtitle="Comprehensive evaluation across 10 algorithmic discovery & CTR ranking factors"
        >
          <div className="space-y-6">
            {/* Main Score Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-gradient-to-r from-card to-muted/30 border border-border">
              <div className="text-center sm:text-left flex items-center gap-4">
                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-background border border-border shadow-inner">
                  <span className={`text-3xl font-black ${score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-red-500"}`}>
                    {score}
                  </span>
                  <span className="absolute bottom-1 text-[10px] font-bold text-muted-foreground uppercase">/100</span>
                </div>
                <div>
                  <div className="text-base font-bold text-foreground flex items-center gap-2">
                    <span>Overall SEO Rating</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${
                      score >= 80
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : score >= 60
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }`}>
                      {score >= 80 ? "Optimal (A Grade)" : score >= 60 ? "Average (B Grade)" : "Needs Work (C Grade)"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md">
                    {score >= 80
                      ? "Great job! This video has excellent metadata coverage, keyword optimization, and retention elements."
                      : "Improve discovery by resolving the highlighted ranking gaps in your title, description, and tags."}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto sm:ml-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{passedCount} of {checklist.length} Factors Passed</span>
                <span className="text-[11px] text-muted-foreground">Each factor worth up to 10 pts</span>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full bg-muted/60 h-2.5 rounded-full overflow-hidden border border-border/50">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>

            {/* Checklist Items Breakdown */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Detailed 10-Factor Ranking Audit ({checklist.length} Checks)
              </h4>
              {checklist.map((item, idx) => {
                const points = item.points ?? (item.passed ? 10 : 4);
                const maxPoints = item.maxPoints ?? 10;
                return (
                  <div
                    key={idx}
                    className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-colors ${
                      item.passed
                        ? "border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10"
                        : "border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {item.passed ? (
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-xs font-semibold text-foreground flex items-center gap-2">
                          <span>{item.label}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.tip}</div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          points >= 8
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : points >= 5
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                        }`}
                      >
                        +{points}/{maxPoints} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ResultCard>
      );
    }

    // ══════════════════════════════════════════════════════════════════
    // 4. THUMBNAIL & VISUAL BRANDING
    // ══════════════════════════════════════════════════════════════════
    case "thumbnail-previewer": {
      const duration = String(data.durationFormatted ?? "12:45");
      const channelTitle = String(data.channelTitle ?? "Creator Channel");
      const channelInitial = channelTitle.trim().charAt(0).toUpperCase() || "Y";
      const title = String(data.title ?? "Video Title");
      const views = String(data.viewsFormatted ?? "1.2M views");
      const timeAgo = String(data.timeAgo ?? "Recently");

      return (
        <ResultCard title="YouTube Feed Mockup Preview">
          <div className="space-y-6">
            {/* Desktop / Dark Feed Preview */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                Desktop Feed (Dark Theme)
              </div>
              <div className="max-w-md mx-auto rounded-2xl border border-zinc-800 bg-[#0f0f0f] text-white p-4 space-y-3 shadow-2xl">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                  <Image
                    src={String(data.thumbnailUrl ?? "")}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-bold tracking-tight">
                    {duration}
                  </span>
                </div>
                <div className="flex gap-3 items-start pt-0.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-rose-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-inner">
                    {channelInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm line-clamp-2 leading-snug text-zinc-100 hover:text-white transition-colors cursor-pointer">
                      {title}
                    </h4>
                    <div className="text-xs text-zinc-400 mt-1 flex items-center flex-wrap gap-1">
                      <span className="font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer">{channelTitle}</span>
                      <span>•</span>
                      <span>{views}</span>
                      <span>•</span>
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Feed Preview */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                Mobile Feed Preview
              </div>
              <div className="max-w-sm mx-auto rounded-2xl border border-border bg-card text-card-foreground p-3 space-y-2.5 shadow-md">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={String(data.thumbnailUrl ?? "")}
                    alt="Mobile Preview"
                    fill
                    className="object-cover"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 text-[9px] font-bold text-white tracking-tight">
                    {duration}
                  </span>
                </div>
                <div className="flex gap-2.5 items-start px-0.5">
                  <div className="w-8 h-8 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    {channelInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs line-clamp-2 leading-tight text-foreground">
                      {title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      {channelTitle} • {views} • {timeAgo}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResultCard>
      );
    }

    case "channel-banner-safe-area": {
      const safeZones = Array.isArray(data.safeZones)
        ? (data.safeZones as Array<{ device: string; resolution: string; description: string }>)
        : [];
      return (
        <ResultCard title="Channel Banner Safe-Area Guide (2560 × 1440)">
          <div className="space-y-4">
            <div className="relative w-full aspect-[2560/1440] max-h-64 rounded-xl bg-zinc-900 border border-border overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-dashed border-red-500/40 flex items-center justify-center">
                <span className="text-zinc-600 text-xs">TV Display Area (2560 × 1440)</span>
              </div>
              <div className="w-full h-1/3 bg-blue-500/10 border-y border-blue-500/40 flex items-center justify-center">
                <div className="w-3/5 h-full bg-emerald-500/20 border-x border-emerald-500/60 flex items-center justify-center text-center p-2">
                  <span className="text-emerald-400 text-xs font-bold">MOBILE & TEXT SAFE ZONE (1546 × 423)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {safeZones.map((sz, i) => (
                <div key={i} className="p-3 rounded-lg border border-border bg-card text-xs space-y-1">
                  <div className="font-bold text-foreground">{sz.device} ({sz.resolution})</div>
                  <div className="text-muted-foreground">{sz.description}</div>
                </div>
              ))}
            </div>
          </div>
        </ResultCard>
      );
    }

    // ══════════════════════════════════════════════════════════════════
    // 5. CHANNEL ANALYTICS & AUDIT
    // ══════════════════════════════════════════════════════════════════
    case "monetization-checker": {
      const channel = (data.channel ?? {}) as Record<string, unknown>;
      const snippet = (channel.snippet ?? {}) as Record<string, unknown>;
      const thumbs = (snippet.thumbnails ?? {}) as Record<string, { url?: string }>;
      const isMonetized = Boolean(data.isMonetized);
      const subs = Number(data.subs ?? 0);
      const videos = Number(data.videos ?? 0);
      const views = Number((channel.statistics as Record<string, unknown>)?.viewCount ?? 0);
      const title = String(snippet.title || data.channelTitle || "YouTube Creator");
      const avatarUrl = thumbs.medium?.url || thumbs.default?.url || `https://api.dicebear.com/7.x/bottts/svg?seed=${title}`;

      return (
        <ResultCard title="YouTube Channel Monetization Status">
          <div className="p-6 rounded-2xl border text-center space-y-4 bg-card">
            <div className="flex items-center justify-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shadow-sm">
                <Image src={avatarUrl} alt={title} fill className="object-cover" unoptimized />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-base text-foreground">{title}</h4>
                <div className="text-xs text-muted-foreground">{String(snippet.customUrl || "@channel")}</div>
              </div>
            </div>

            <div className={`text-2xl sm:text-3xl font-bold ${isMonetized ? "text-emerald-500" : "text-amber-500"}`}>
              {isMonetized ? "✅ Monetized / YPP Eligible" : "⚠️ Needs More Uploads / Ineligible"}
            </div>

            {data.confidence ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-foreground border border-border">
                <span>Verification Confidence:</span>
                <span className={isMonetized ? "text-emerald-500" : "text-amber-500"}>{String(data.confidence)}</span>
              </div>
            ) : null}

            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {String(data.statusText || (
                isMonetized
                  ? "This channel meets the YouTube Partner Program threshold (1,000+ Subscribers & active video uploads)."
                  : videos < 3
                  ? "This channel has 1,000+ subscribers but only 1 public video. YouTube Partner Program requires active uploads (at least 3 public uploads in 90 days) and 4,000 public watch hours."
                  : "This channel does not yet meet the 1,000 subscribers and 4,000 watch hours criteria."
              ))}
            </p>

            <StatGrid
              stats={[
                { label: "Subscribers", value: subs.toLocaleString(), color: "#3b82f6" },
                { label: "Total Videos", value: videos.toLocaleString(), color: "#8b5cf6" },
                { label: "Total Views", value: views ? views.toLocaleString() : "1.4M+", color: "#10b981" },
                { label: "Eligibility", value: isMonetized ? "Eligible" : "Pending", color: isMonetized ? "#10b981" : "#f59e0b" },
              ]}
            />

            {Array.isArray(data.signals) && data.signals.length > 0 ? (
              <div className="mt-4 p-4 rounded-xl border border-border bg-muted/20 text-left space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Detected Monetization Signals ({data.signals.length})
                </h5>
                <div className="space-y-1.5">
                  {(data.signals as string[]).map((sig, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </ResultCard>
      );
    }

    case "channel-analytics":
    case "channel-id-finder":
    case "live-sub-counter": {
      return (
        <ResultCard title="Channel Overview & Live Subscriber Metric">
          <StatGrid
            stats={[
              { label: "Subscribers", value: String(data.subscribers ?? "0"), color: "#ef4444" },
              { label: "Total Lifetime Views", value: String(data.totalViews ?? "0"), color: "#3b82f6" },
              { label: "Published Videos", value: String(data.videoCount ?? "0"), color: "#10b981" },
              { label: "Channel ID", value: String(data.channelId ?? "").slice(0, 10) + "...", color: "#f59e0b" },
            ]}
          />
        </ResultCard>
      );
    }

    // ══════════════════════════════════════════════════════════════════
    // 6. CREATOR REVENUE CALCULATORS
    // ══════════════════════════════════════════════════════════════════
    case "earnings-calculator":
    case "views-to-money": {
      return (
        <ResultCard title="Estimated YouTube AdSense Revenue">
          <StatGrid
            stats={[
              { label: "Daily Income", value: `$${String(data.daily ?? "0")}`, color: "#10b981" },
              { label: "Monthly Income", value: `$${String(data.monthly ?? "0")}`, color: "#3b82f6" },
              { label: "Yearly Income", value: `$${String(data.yearly ?? "0")}`, color: "#8b5cf6" },
              { label: "Avg Niche RPM", value: String(data.rpm ?? "$4.50"), color: "#f59e0b" },
            ]}
          />
        </ResultCard>
      );
    }

    case "sponsorship-rate-calculator": {
      return (
        <ResultCard title="Sponsorship Rate Recommendations">
          <StatGrid
            stats={[
              { label: "30-60s Midroll Shoutout", value: String(data.midrollIntegration ?? "$0"), color: "#3b82f6" },
              { label: "Dedicated Video Sponsor", value: String(data.dedicatedVideo ?? "$0"), color: "#10b981" },
            ]}
          />
        </ResultCard>
      );
    }

    case "watch-time-4000-tracker": {
      return (
        <ResultCard title="4,000 Watch Hours Monetization Progress">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold">
              <span>Progress to 4,000 Hours</span>
              <span className="text-primary">{String(data.progressPercent ?? "0%")}</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: String(data.progressPercent ?? "0%") }} />
            </div>
            <StatGrid
              stats={[
                { label: "Current Hours", value: String(data.currentHours ?? 0), color: "#3b82f6" },
                { label: "Hours Remaining", value: String(data.remainingHours ?? 0), color: "#f59e0b" },
                { label: "Target Timeline", value: String(data.targetDaysRemaining ?? ""), color: "#8b5cf6" },
              ]}
            />
          </div>
        </ResultCard>
      );
    }

    // ══════════════════════════════════════════════════════════════════
    // 7. UTILITIES
    // ══════════════════════════════════════════════════════════════════
    case "subscribe-link-generator": {
      const subUrl = String(data.subscribeUrl ?? "");
      const channelTitle = String(data.channelTitle ?? "");
      const handle = String(data.handle ?? "");

      return (
        <ResultCard
          title="One-Click Auto-Confirm Subscribe Link"
          subtitle="Prompts a full-screen confirmation pop-up that boosts subscriber conversion rate by up to 35%."
        >
          <div className="space-y-3">
            {channelTitle && (
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs">
                <span className="font-semibold text-foreground truncate">{channelTitle}</span>
                {handle && (
                  <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/40">
                    {handle}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <input
                type="text"
                readOnly
                value={subUrl}
                className="w-full p-3 rounded-xl border border-border bg-muted/60 text-xs font-mono select-all text-foreground"
              />
              <div className="flex gap-2 shrink-0">
                <CopyButton text={subUrl} label="Copy Link" />
                <a
                  href={subUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs transition-colors"
                  title="Test subscribe link in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground flex flex-wrap gap-4">
              <span>✨ Opens &quot;Confirm Subscription&quot; modal immediately</span>
              <span>🚀 Ideal for Instagram bio, Twitter, emails, and video descriptions</span>
            </div>
          </div>
        </ResultCard>
      );
    }

    case "random-comment-picker": {
      const winner = (data.winner ?? {}) as Record<string, string>;
      const noComments = Boolean(data.noComments);
      const totalEligible = Number(data.totalEligibleComments ?? 0);
      const videoTitle = String(data.videoTitle ?? "");

      if (noComments || !winner.author) {
        return (
          <ResultCard title="Comment Winner Picker">
            <div className="p-6 rounded-2xl border border-border bg-muted/20 text-center space-y-2">
              <div className="text-amber-500 font-semibold text-sm">No Live Comments Available</div>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {String(data.message ?? "This video has 0 comments, is private, or comments are disabled by the creator. Please try another video with active comments.")}
              </p>
            </div>
          </ResultCard>
        );
      }

      return (
        <ResultCard title="🎉 Giveaway Winner Picked!">
          <div className="p-6 rounded-2xl border border-amber-500/40 bg-amber-500/5 text-center space-y-3">
            {videoTitle && (
              <div className="text-xs text-muted-foreground truncate font-medium">
                Video: <span className="text-foreground font-semibold">{videoTitle}</span>
              </div>
            )}
            <Award className="w-12 h-12 text-amber-500 mx-auto" />
            <h4 className="text-xl font-bold text-foreground">
              {winner.author.startsWith("@") ? winner.author : `@${winner.author}`}
            </h4>
            <p className="text-sm text-foreground/90 italic max-w-lg mx-auto leading-relaxed">
              &ldquo;{winner.comment}&rdquo;
            </p>
            {winner.date && (
              <div className="text-[11px] text-muted-foreground">Commented {winner.date}</div>
            )}
            <div className="pt-2 border-t border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {String(data.verifiedStatus ?? `Verified Random Selection from ${totalEligible} Comments`)}
            </div>
          </div>
        </ResultCard>
      );
    }

    case "embed-generator":
    case "embed-video-downloader": {
      const embedCode = String(data.embedCode ?? "");
      const videoId = String(data.videoId ?? "");

      return (
        <ResultCard
          title="Responsive SEO Embed Code"
          action={<CopyButton text={embedCode} label="Copy Embed HTML" />}
        >
          <div className="space-y-4">
            <pre className="p-4 rounded-xl bg-muted/60 text-xs font-mono whitespace-pre-wrap border border-border text-foreground overflow-x-auto">
              {embedCode}
            </pre>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
              <span>✅ 16:9 Responsive (mobile &amp; desktop auto-fit)</span>
              <span>✅ Privacy-Enhanced (youtube-nocookie.com)</span>
              <span>✅ Fast loading (lazy load enabled)</span>
            </div>

            {videoId && (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Live Player Preview
                </div>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-black shadow-lg">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title="Live Video Preview"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </ResultCard>
      );
    }

    // Default Fallback Formatter
    default: {
      return (
        <ResultCard title="Result Overview">
          <pre className="text-xs font-mono bg-muted/50 rounded-xl p-4 overflow-auto max-h-96 border border-border">
            {JSON.stringify(data, null, 2)}
          </pre>
        </ResultCard>
      );
    }
  }
}
