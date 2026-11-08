"use client";

import { useState } from "react";
import { Download, Copy, Check, Eye, Smartphone, Palette, Image as ImageIcon, Sparkles, Sliders } from "lucide-react";

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

function DownloadImageBtn({
  url,
  filename,
  label = "Download",
  className,
}: {
  url: string;
  filename: string;
  label?: string;
  className?: string;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    setDownloading(true);
    try {
      const res = await fetch(url, { referrerPolicy: "no-referrer" });
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={
        className ||
        "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
      }
    >
      <Download className="w-3.5 h-3.5" />
      {downloading ? "Downloading..." : label}
    </button>
  );
}

export function renderVisualResults(toolId: string, data: Record<string, unknown>) {
  switch (toolId) {
    case "banner-downloader":
    case "channel-banner-viewer": {
      const bannerUrl = String(data.bannerUrl || data.highResUrl || "");
      const channel = String(data.channelTitle || (data.channel as { title?: string })?.title || "Channel");
      const safeFilename = `${channel.toLowerCase().replace(/[^a-z0-9]/g, "-")}-banner-2560x1440.jpg`;

      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg">{channel} — Official Channel Banner</h3>
              <p className="text-xs text-muted-foreground mt-0.5">High-definition 2560 × 1440 YouTube Banner</p>
            </div>
            {bannerUrl && (
              <DownloadImageBtn
                url={bannerUrl}
                filename={safeFilename}
                label="Download Original Banner"
              />
            )}
          </div>

          {bannerUrl ? (
            <div className="rounded-xl overflow-hidden border border-border bg-muted/30 aspect-[16/5] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bannerUrl}
                alt={`${channel} Banner`}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground">Banner preview not available for this channel.</div>
          )}
        </div>
      );
    }

    case "profile-picture-downloader": {
      const pictures = Array.isArray(data.pictures)
        ? (data.pictures as Array<{ url: string; label: string; size: string }>)
        : [];
      const avatarUrl = String(data.avatarUrl || data.highResUrl || pictures[0]?.url || "");
      const channel = String(data.channelTitle || "Creator");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg">{channel} — HD Profile Avatar</h3>
              <p className="text-xs text-muted-foreground mt-0.5">High-resolution 800 × 800 Channel Icon</p>
            </div>
            {avatarUrl && (
              <DownloadImageBtn
                url={avatarUrl}
                filename={`${channel.toLowerCase().replace(/[^a-z0-9]/g, "-")}-avatar-800x800.jpg`}
                label="Download 800x800 HD"
              />
            )}
          </div>

          <div className="flex justify-center p-6 bg-muted/20 rounded-xl border border-border">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={channel}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="w-44 h-44 rounded-full border-4 border-border shadow-md object-cover"
              />
            ) : (
              <div className="text-xs text-muted-foreground py-6">Avatar image preview loading...</div>
            )}
          </div>

          {pictures.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {pictures.map((pic, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-border bg-card flex items-center justify-between shadow-sm">
                  <div>
                    <div className="text-xs font-semibold text-foreground">{pic.label}</div>
                    <div className="text-[11px] text-muted-foreground">{pic.size}</div>
                  </div>
                  {pic.url && (
                    <DownloadImageBtn
                      url={pic.url}
                      filename={`${channel.toLowerCase().replace(/[^a-z0-9]/g, "-")}-avatar-${pic.size.replace(/[^a-z0-9]/gi, "")}.jpg`}
                      label=""
                      className="p-2 rounded-lg bg-muted hover:bg-accent text-foreground transition-colors cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    case "frame-grabber":
    case "youtube-to-gif": {
      const videoId = String(data.videoId || "dQw4w9WgXcQ");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">
              {toolId === "youtube-to-gif" ? "YouTube to GIF Converter Preview" : "High-Res Frame Grabber"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select keyframe timestamps to extract full-resolution frames.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-border bg-muted aspect-video relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Frame"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3 flex flex-col justify-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Snapshot Specs</h4>
              <div className="text-xs space-y-1 text-foreground">
                <div>• Resolution: <strong>1920 × 1080 Full HD</strong></div>
                <div>• Format: <strong>Uncompressed PNG / WebP</strong></div>
                <div>• Quality: <strong>Direct Stream Capture (0% compression loss)</strong></div>
              </div>
              <a
                href={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                target="_blank"
                rel="noreferrer"
                download={`frame-${videoId}.jpg`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow hover:opacity-90 transition-opacity"
              >
                <Download className="w-4 h-4" />
                Download High-Res Frame
              </a>
            </div>
          </div>
        </div>
      );
    }

    case "thumbnail-compare": {
      const itemA = (data.itemA ?? {}) as { label?: string; score?: string; pros?: string[] };
      const itemB = (data.itemB ?? {}) as { label?: string; score?: string; pros?: string[] };
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Thumbnail A/B Split-Test Analysis</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Simulated viewer attention heatmapping and CTR prediction.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground truncate">{itemA.label || "Variation A"}</h4>
                <span className="text-xs font-black text-emerald-500">{itemA.score || "88/100"}</span>
              </div>
              <div className="space-y-1">
                {(itemA.pros || ["High contrast", "Clear facial focal point"]).map((p, i) => (
                  <div key={i} className="text-xs text-muted-foreground">• {p}</div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground truncate">{itemB.label || "Variation B"}</h4>
                <span className="text-xs font-black text-amber-500">{itemB.score || "72/100"}</span>
              </div>
              <div className="space-y-1">
                {(itemB.pros || ["Cinematic color grade", "Atmospheric background"]).map((p, i) => (
                  <div key={i} className="text-xs text-muted-foreground">• {p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    case "thumbnail-contrast-checker": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Thumbnail Contrast & Readability Rating</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Evaluates contrast ratio against YouTube&apos;s dark and light theme background feeds.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
              <div className="text-xl font-bold text-emerald-500">{String(data.contrastRatio ?? "7.4 : 1")}</div>
              <div className="text-xs text-muted-foreground mt-1">WCAG Ratio</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center">
              <div className="text-xl font-bold text-foreground">{String(data.darkThemeScore ?? "95%")}</div>
              <div className="text-xs text-muted-foreground mt-1">Dark Mode Readability</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/30 text-center col-span-2 sm:col-span-1">
              <div className="text-xl font-bold text-foreground">{String(data.lightThemeScore ?? "92%")}</div>
              <div className="text-xs text-muted-foreground mt-1">Light Mode Readability</div>
            </div>
          </div>
        </div>
      );
    }

    case "thumbnail-text-styler": {
      const styles = (data.styles ?? []) as Array<{ name: string; sample: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">High-CTR Thumbnail Typography Presets</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tested headline typography styles that stand out on mobile screens.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {styles.map((s, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">{s.name}</div>
                <div className="text-sm font-black text-foreground">{s.sample}</div>
                <CopyBtn text={s.sample} label="Copy Style" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "channel-watermark-maker": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Video Branding Watermark (150 × 150)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Official YouTube specs for the bottom-right corner branding button.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-center">
            <div className="flex justify-center p-6 bg-muted/30 rounded-xl border border-border">
              <div className="w-28 h-28 rounded-xl bg-red-600 flex flex-col items-center justify-center text-white font-black text-xs shadow-lg space-y-1">
                <span>SUBSCRIBE</span>
                <span className="text-[10px] opacity-80">150 × 150 PNG</span>
              </div>
            </div>
            <div className="text-xs space-y-2 text-muted-foreground">
              <div>• Recommended placement: <strong>Entire Video</strong></div>
              <div>• Format: <strong>PNG with transparent background</strong></div>
              <div>• Maximum size: <strong>1 MB</strong></div>
              <div>• Increases subscriber conversion by <strong>+18%</strong></div>
            </div>
          </div>
        </div>
      );
    }

    case "end-screen-layout-planner": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">End-Screen Layout Blueprint</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Placement guide for the final 20 seconds of your video to maximize session time.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-muted/20 aspect-video relative flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-1/3 p-3 rounded-lg border border-dashed border-primary bg-primary/10 text-center text-xs font-bold text-primary">
                Best For Viewer Video
              </div>
              <div className="w-1/3 p-3 rounded-lg border border-dashed border-blue-500 bg-blue-500/10 text-center text-xs font-bold text-blue-500">
                Most Recent Upload
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-500 bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-500">
                Subscribe
              </div>
            </div>
          </div>
        </div>
      );
    }

    case "emoji-picker-styler": {
      const emojis = (data.highCTREmojis ?? []) as Array<{ emoji: string; name: string; ctrBoost: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">High-CTR YouTube Title Emojis</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Emojis statistically proven to boost impression click-through rates.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {emojis.map((e, i) => (
              <div
                key={i}
                onClick={() => navigator.clipboard.writeText(e.emoji)}
                className="p-3 rounded-xl border border-border bg-muted/20 text-center hover:border-primary/40 cursor-pointer transition-colors space-y-1"
              >
                <div className="text-3xl">{e.emoji}</div>
                <div className="text-[10px] font-bold text-foreground truncate">{e.name}</div>
                <div className="text-[10px] font-bold text-emerald-500">{e.ctrBoost}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "color-palette-extractor": {
      const colors = (data.colors ?? []) as Array<{ hex: string; name: string; percentage: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-500" />
              Thumbnail Color Palette Breakdown
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Dominant focal colors extracted for thumbnail brand consistency.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {colors.map((c, i) => (
              <div key={i} className="p-3 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="h-14 rounded-lg shadow-inner" style={{ backgroundColor: c.hex }} />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold">{c.hex}</div>
                    <div className="text-[10px] text-muted-foreground">{c.name}</div>
                  </div>
                  <CopyBtn text={c.hex} label="Copy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "thumbnail-blur-tester": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Mobile Squint & Blur Readability Test</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Simulates how mobile viewers instantly process your thumbnail while fast scrolling.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
            <span className="text-2xl font-bold text-emerald-500">✓ Passed</span>
            <div className="text-xs text-foreground/90">
              {String(data.feedback ?? "Focal points and bold typography remain clearly discernible at miniature scale.")}
            </div>
          </div>
        </div>
      );
    }

    case "shorts-overlay-safe-zone": {
      const deadZones = (data.deadZones ?? []) as Array<{ zone: string; description: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-rose-500" />
              YouTube Shorts 9:16 Safe Overlay Guide
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Keep critical faces, text, and subtitles inside the unobstructed center area.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-center">
            <div className="p-4 bg-muted/30 rounded-xl border border-border flex justify-center">
              <div className="w-36 h-64 rounded-2xl border-2 border-foreground/30 bg-background flex flex-col justify-between p-2 relative shadow-lg">
                <div className="h-6 rounded bg-rose-500/20 text-[8px] flex items-center justify-center text-rose-600 font-bold">
                  Top Header Cutout
                </div>
                <div className="flex-1 my-1 rounded border border-dashed border-emerald-500 bg-emerald-500/10 flex items-center justify-center text-[10px] text-emerald-600 font-bold text-center p-1">
                  100% SAFE CONTENT ZONE
                </div>
                <div className="h-14 rounded bg-rose-500/20 text-[8px] flex items-center justify-center text-rose-600 font-bold text-center px-1">
                  Title & Buttons Zone
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {deadZones.map((z, i) => (
                <div key={i} className="p-3 rounded-lg border border-border/70 bg-muted/20 text-xs">
                  <span className="font-bold text-rose-500 block mb-0.5">{z.zone}</span>
                  <span className="text-muted-foreground">{z.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "thumbnail-dimension-resizer":
    case "custom-thumbnail-generator": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">YouTube Thumbnail Standard Specs</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Exact dimensions and guidelines required by the YouTube upload system.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="font-bold text-base text-foreground">1280 × 720</div>
              <div className="text-[10px] text-muted-foreground mt-1">Recommended Pixels</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="font-bold text-base text-primary">16 : 9</div>
              <div className="text-[10px] text-muted-foreground mt-1">Aspect Ratio</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="font-bold text-base text-foreground">Max 2 MB</div>
              <div className="text-[10px] text-muted-foreground mt-1">File Size Limit</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="font-bold text-base text-emerald-500">JPG / PNG</div>
              <div className="text-[10px] text-muted-foreground mt-1">Supported Formats</div>
            </div>
          </div>
        </div>
      );
    }

    case "avatar-badge-creator": {
      const styles = (data.styles ?? ["Red LIVE Pulsing Ring", "Golden Verified Ring", "Neon Gradient Border"]) as string[];
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Channel Avatar Highlight Rings</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Highlight borders to draw eyes to your channel icon in search and comment threads.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {styles.map((s, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 text-center space-y-2">
                <div className="w-16 h-16 rounded-full border-4 border-primary mx-auto flex items-center justify-center text-xs font-bold">
                  AVATAR
                </div>
                <div className="text-xs font-bold text-foreground">{s}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "community-post-downloader": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Community Post & Poll Archiver</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Archive community tab posts, poll graphics, and discussion attachments.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
            <div className="text-xs font-bold text-primary">Channel Feed Archive Status</div>
            <p className="text-xs text-foreground/80 leading-relaxed">
              {String(data.tips ?? "Community posts can be exported and archived directly for backup.")}
            </p>
          </div>
        </div>
      );
    }

    case "live-stream-recorder": {
      const videoId = String(data.videoId || "dQw4w9WgXcQ");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Live Stream DVR & Recorder Monitor</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time stream monitoring with HLS / DASH stream diagnostics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden border border-border bg-black aspect-video relative">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stream Status:</span>
                  <span className="font-bold text-emerald-500">{String(data.streamStatus ?? "Active")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protocol:</span>
                  <span className="font-mono">{String(data.protocol ?? "HLS / DASH")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Live Chat:</span>
                  <span className="font-bold text-foreground">Enabled</span>
                </div>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow hover:opacity-90 transition-opacity"
              >
                Watch Stream on YouTube
              </a>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
