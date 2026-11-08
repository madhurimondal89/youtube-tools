"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Link as LinkIcon, CheckSquare, ShieldCheck, Rss, Layers, TrendingUp, Type, FileText, CheckCircle2, Clock, Sparkles, Play } from "lucide-react";

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
      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent transition-colors shadow-sm cursor-pointer min-w-[85px]"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

export function renderProductivityResults(toolId: string, data: Record<string, unknown>) {
  switch (toolId) {
    case "timestamp-link-generator": {
      const link = String(data.timestampUrl || data.url || "");
      const short = String(data.shortUrl || "");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" />
              Direct Timestamp Jump Link
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Clicking this link starts the video at the exact moment.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">Full Timestamp Link</span>
                <span className="font-mono text-xs text-foreground truncate block">{link}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <CopyBtn text={link} label="Copy Link" />
                <a href={link} target="_blank" rel="noreferrer" className="p-2 rounded-lg border border-border bg-card hover:bg-accent">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {short && (
              <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">Short youtu.be Link</span>
                  <span className="font-mono text-xs text-foreground truncate block">{short}</span>
                </div>
                <CopyBtn text={short} label="Copy Short Link" />
              </div>
            )}
          </div>
        </div>
      );
    }

    case "url-parser": {
      const parsed = (data.parsed ?? data) as Record<string, unknown>;
      const videoId = String(data.videoId || parsed.videoId || "");
      const urlType = String(data.type || parsed.type || "unknown");
      const isValid = Boolean(data.isValid ?? parsed.isValid);
      const cleanUrl = String(data.cleanUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : parsed.raw || ""));
      const shortUrl = String(data.shortUrl || (videoId ? `https://youtu.be/${videoId}` : ""));
      const embedUrl = String(data.embedUrl || (videoId ? `https://www.youtube.com/embed/${videoId}` : ""));
      const embedIframe = String(
        data.embedIframe ||
          (videoId
            ? `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
            : "")
      );
      const thumbnailMaxRes = String(data.thumbnailMaxRes || (videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : ""));
      const thumbnailHq = String(data.thumbnailHq || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ""));
      const timestamp = String(data.timestamp || parsed.timestamp || "");
      const playlistId = String(data.playlistId || parsed.playlistId || "");
      const channelId = String(data.channelId || parsed.channelId || "");
      const username = String(data.username || parsed.username || "");
      const clipId = String(data.clipId || parsed.clipId || "");
      const queryParams = (data.queryParams || parsed.queryParams || {}) as Record<string, string>;

      const typeLabels: Record<string, { label: string; color: string }> = {
        video: { label: "Standard Video (Watch URL)", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
        shorts: { label: "YouTube Shorts", color: "bg-red-500/10 text-red-500 border-red-500/20" },
        playlist: { label: "YouTube Playlist", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
        channel: { label: "YouTube Channel", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
        username: { label: "Channel Handle (@user)", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
        clip: { label: "YouTube Clip", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
        unknown: { label: "Unknown / Custom Query", color: "bg-muted text-muted-foreground border-border" },
      };

      const activeType = typeLabels[urlType] || typeLabels.unknown;

      return (
        <div className="space-y-6">
          {/* Main Inspection Summary Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-primary" />
                    YouTube URL Deconstruction Analysis
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${activeType.color}`}>
                    {activeType.label}
                  </span>
                  {isValid && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid Link
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono truncate max-w-xl">
                  {String(data.rawUrl || parsed.raw || "")}
                </p>
              </div>

              {videoId && (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground font-medium">Video ID:</span>
                  <span className="font-mono font-bold text-xs px-2.5 py-1 bg-muted rounded-md border border-border text-foreground">
                    {videoId}
                  </span>
                  <CopyBtn text={videoId} label="Copy ID" />
                </div>
              )}
            </div>

            {/* Video Preview & Core Extracted Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {videoId ? (
                <div className="md:col-span-1 rounded-xl overflow-hidden border border-border bg-muted/30 relative group">
                  <img
                    src={thumbnailHq || thumbnailMaxRes}
                    alt="Video thumbnail"
                    referrerPolicy="no-referrer"
                    className="w-full aspect-video object-cover"
                    loading="lazy"
                  />
                  <div className="p-3 bg-card/90 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="font-mono text-[11px] text-muted-foreground">ID: {videoId}</span>
                    <a
                      href={`https://www.youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-medium inline-flex items-center gap-1 text-[11px]"
                    >
                      Watch <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : null}

              <div className={`${videoId ? "md:col-span-2" : "md:col-span-3"} grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs`}>
                <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">URL Routing Type</span>
                  <span className="font-semibold text-foreground text-sm capitalize">{urlType}</span>
                </div>

                {videoId ? (
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
                    <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">Standard Video ID</span>
                    <span className="font-mono text-foreground font-semibold text-sm">{videoId}</span>
                  </div>
                ) : null}

                {timestamp ? (
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
                    <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">Start Time / Timestamp</span>
                    <span className="font-mono text-foreground font-semibold text-sm flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> {timestamp}
                    </span>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
                    <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">Timestamp</span>
                    <span className="text-muted-foreground text-xs">None (Plays from 0:00)</span>
                  </div>
                )}

                {playlistId ? (
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
                    <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">Playlist ID</span>
                    <span className="font-mono text-foreground font-semibold text-xs truncate block">{playlistId}</span>
                  </div>
                ) : null}

                {channelId ? (
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
                    <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">Channel ID</span>
                    <span className="font-mono text-foreground font-semibold text-xs truncate block">{channelId}</span>
                  </div>
                ) : null}

                {username ? (
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
                    <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">Channel Handle / User</span>
                    <span className="font-mono text-foreground font-semibold text-xs">@{username}</span>
                  </div>
                ) : null}

                {clipId ? (
                  <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
                    <span className="font-bold text-muted-foreground uppercase text-[10px] block mb-1">Clip ID</span>
                    <span className="font-mono text-foreground font-semibold text-xs truncate block">{clipId}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Clean URLs & Shareable Formats */}
          {cleanUrl && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-border/60">
                <h4 className="font-bold text-base text-foreground">Clean, Tracker-Free Formats</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Clean links with UTM / tracking parameters (si=, feature=, pp=) stripped out.
                </p>
              </div>

              <div className="space-y-3">
                {/* Canonical Watch URL */}
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">Clean Canonical URL</span>
                    <span className="font-mono text-foreground truncate block">{cleanUrl}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <CopyBtn text={cleanUrl} label="Copy Link" />
                    <a href={cleanUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Short youtu.be Link */}
                {shortUrl && (
                  <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">Short Share Link (youtu.be)</span>
                      <span className="font-mono text-primary font-medium truncate block">{shortUrl}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <CopyBtn text={shortUrl} label="Copy Short Link" />
                      <a href={shortUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Embed URL */}
                {embedUrl && (
                  <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">Direct Player Embed URL</span>
                      <span className="font-mono text-foreground truncate block">{embedUrl}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <CopyBtn text={embedUrl} label="Copy Embed URL" />
                    </div>
                  </div>
                )}

                {/* HTML iframe Embed Code */}
                {embedIframe && (
                  <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">HTML iframe Embed Code</span>
                      <span className="font-mono text-xs text-muted-foreground truncate block">{embedIframe}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <CopyBtn text={embedIframe} label="Copy iframe Code" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detected Query Parameters Breakdown */}
          {Object.keys(queryParams).length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="pb-3 border-b border-border/60">
                <h4 className="font-bold text-base text-foreground">Detected Query Parameters ({Object.keys(queryParams).length})</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Parameters extracted from the URL query string and their meanings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(queryParams).map(([key, val]) => {
                  const paramDescriptions: Record<string, string> = {
                    v: "Video Unique Identifier",
                    t: "Playback Start Timestamp",
                    list: "Playlist Identifier",
                    si: "YouTube Tracking & Share Telemetry",
                    feature: "Traffic Source / UI Referral Hook",
                    pp: "Platform / Presentation Flag",
                    ab_channel: "Channel Attribution Flag",
                  };
                  const desc = paramDescriptions[key] || "Custom Query Parameter";
                  return (
                    <div key={key} className="p-3 rounded-xl border border-border/70 bg-muted/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-primary text-xs uppercase">{key}</span>
                        <span className="text-[10px] text-muted-foreground">{desc}</span>
                      </div>
                      <span className="font-mono text-foreground break-all text-xs block font-medium">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    case "description-link-formatter": {
      const links = (data.formattedLinks ?? []) as Array<{ label: string; url: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg">Formatted Description Link Cluster</h3>
              <p className="text-xs text-muted-foreground mt-0.5">High-CTR link labels with emojis for social and gear links.</p>
            </div>
            <CopyBtn
              text={links.map((l) => `${l.label}: ${l.url}`).join("\n")}
              label="Copy All Links"
            />
          </div>

          <div className="space-y-2">
            {links.map((l, i) => (
              <div key={i} className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-foreground">{l.label}</span>
                <span className="font-mono text-primary truncate max-w-xs">{l.url}</span>
                <CopyBtn text={`${l.label}: ${l.url}`} label="Copy" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "dislike-ratio-estimator": {
      const approval = String(data.approvalRating ?? "97.8%");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Return YouTube Dislike Ratio Estimate</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Community engagement approval rating and estimated dislike count.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-3xl font-black text-emerald-500">{approval}</div>
              <div className="text-xs text-muted-foreground mt-1">Audience Approval Rate</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-foreground">{String(data.estimatedLikes ?? "12,500")}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Likes</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-muted-foreground">{String(data.estimatedDislikes ?? "280")}</div>
              <div className="text-xs text-muted-foreground mt-1">Estimated Dislikes</div>
            </div>
          </div>
        </div>
      );
    }

    case "dmca-copyright-checklist": {
      const items = (data.checklist ?? [
        "100% royalty-free or licensed background music (Epidemic Sound / YouTube Audio Library)",
        "Zero copyrighted music tracks longer than 5 seconds",
        "Video game or movie b-roll commentary fits under Fair Use guidelines",
        "No copyright-protected logos without transformational commentary",
        "All stock footage sources attributed if required by CC licenses",
      ]) as string[];
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Pre-Upload DMCA & Copyright Safety Checklist
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Prevent Content ID claims and channel copyright strikes.</p>
          </div>

          <div className="space-y-2.5">
            {items.map((item, i) => (
              <label key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4" />
                <span className="text-xs font-medium text-foreground">{item}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    case "video-checklist-manager": {
      const checklist = (data.tasks ?? [
        "Eye-catching 1280x720 thumbnail with &lt;4 words of bold text",
        "First 3 lines of description contain primary keyword and freebie hook",
        "At least 3 relevant hashtags added to title/description",
        "End-screen elements configured for the final 20 seconds",
        "Pinned comment posted with question of the day",
        "Captions / subtitles uploaded or checked for accuracy",
        "Cards configured at high drop-off timestamps",
      ]) as string[];
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Pre-Publish Video Launch Checklist
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Ensure every upload is 100% optimized before switching to Public.</p>
          </div>

          <div className="space-y-2.5">
            {checklist.map((task, i) => (
              <label key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/20 cursor-pointer hover:bg-muted/30 transition-colors">
                <input type="checkbox" className="mt-0.5 rounded text-primary focus:ring-primary h-4 w-4" />
                <span className="text-xs font-medium text-foreground">{task}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    case "live-stream-countdown-maker": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">OBS Live Stream Countdown Clock</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Browser source URL for OBS / Streamlabs countdowns.</p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-r from-red-600 to-purple-600 text-center text-white space-y-2 shadow-lg">
            <div className="text-xs uppercase tracking-widest font-bold opacity-80">Stream Starting In</div>
            <div className="text-5xl font-black font-mono">04 : 59</div>
          </div>
        </div>
      );
    }

    case "youtube-rss-feed-finder": {
      const feedUrl = String(data.rssFeedUrl || data.feedUrl || data.rssUrl || "");
      const channelTitle = String(data.channelTitle ?? "");
      const channelId = String(data.channelId ?? "");

      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Rss className="w-5 h-5 text-amber-500" />
                Official YouTube Channel RSS Feed URL
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Direct XML feed URL for feed readers, Discord bots, and automations.
              </p>
            </div>
            {feedUrl && <CopyBtn text={feedUrl} label="Copy Feed URL" />}
          </div>

          {(channelTitle || channelId) && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="font-semibold text-foreground truncate">{channelTitle || "YouTube Channel"}</span>
              </div>
              {channelId && (
                <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/50">
                  Channel ID: {channelId}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={feedUrl}
              className="w-full p-3 rounded-xl border border-border bg-muted/60 text-xs font-mono select-all text-foreground"
            />
            {feedUrl && (
              <a
                href={feedUrl}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border border-border bg-card hover:bg-accent shrink-0 transition-colors"
                title="Open XML Feed in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground flex flex-wrap gap-4">
            <span>✅ Discord Webhook ready</span>
            <span>✅ Feedly &amp; Inoreader compatible</span>
            <span>✅ Zapier / Make automations</span>
          </div>
        </div>
      );
    }

    case "cards-endscreen-planner": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">Interactive Info Cards Strategy</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Strategic card cue points placed before viewer retention dips.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex justify-between items-center text-xs">
              <span className="font-bold text-primary">Card 1 (Timestamp 02:45)</span>
              <span className="text-muted-foreground">Related Video Card (Topic Teaser)</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex justify-between items-center text-xs">
              <span className="font-bold text-primary">Card 2 (Timestamp 05:30)</span>
              <span className="text-muted-foreground">Playlist Card (Binge Session Builder)</span>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex justify-between items-center text-xs">
              <span className="font-bold text-primary">Card 3 (Timestamp 08:15)</span>
              <span className="text-muted-foreground">External Link / Community Poll Card</span>
            </div>
          </div>
        </div>
      );
    }

    case "niche-profitability-checker": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Niche Monetization & CPM Tier Rating
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Estimated commercial value of viewer demographics in this niche.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-2xl font-black text-emerald-500">{String(data.cpmTier ?? "Tier 1 ($8 - $18 CPM)")}</div>
              <div className="text-xs text-muted-foreground mt-1">Expected CPM Tier</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-foreground">{String(data.sponsorshipDemand ?? "High")}</div>
              <div className="text-xs text-muted-foreground mt-1">Brand Sponsorship Demand</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-primary">{String(data.affiliateViability ?? "Excellent")}</div>
              <div className="text-xs text-muted-foreground mt-1">Affiliate Conversion Score</div>
            </div>
          </div>
        </div>
      );
    }

    case "repurpose-planner": {
      const plan = (data.matrix ?? [
        { platform: "3x YouTube Shorts", output: "Cut 45s hooks from minutes 1:15, 4:20, and 7:05" },
        { platform: "Twitter / X Thread", output: "10-tweet breakdown of core framework with video link in tweet 1" },
        { platform: "LinkedIn Article", output: "Professional case study format highlighting industry implications" },
        { platform: "Newsletter Email", output: "Curated key takeaways delivered to your subscriber list" },
      ]) as Array<{ platform: string; output: string }>;
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Multi-Platform Content Repurposing Roadmap
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">1 long-form video converted into 6 high-reach distribution assets.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {plan.map((p, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-muted/20 space-y-1.5">
                <div className="text-xs font-bold text-primary">{p.platform}</div>
                <div className="text-xs text-foreground/80 leading-relaxed">{p.output}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "capitalize-my-title": {
      const original = String(data.originalText || "");
      const length = Number(data.length || original.length);
      const isUnder60 = Boolean(data.isUnder60Chars ?? length <= 60);
      const formats = Array.isArray(data.formats)
        ? (data.formats as Array<{ label: string; text: string; description: string }>)
        : [];

      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Type className="w-5 h-5 text-amber-500" />
                Capitalize My Title — Multi-Case Converter
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Instant conversion to standard AP, Chicago, Title Case, and YouTube High-CTR capitalization.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                isUnder60 ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {length} chars · {isUnder60 ? "Mobile Optimal (<60)" : "Long Title (>60)"}
              </span>
            </div>
          </div>

          {Boolean(data.fetchedFromVideo) && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>
                <strong>Auto-fetched from YouTube Video:</strong> {String(data.videoSourceTitle || original)}
              </span>
            </div>
          )}

          <div className="grid gap-3.5">
            {formats.map((fmt, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:border-primary/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-primary">{fmt.label}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">({fmt.text.length} chars)</span>
                  </div>
                  <div className="font-semibold text-sm text-foreground break-words">{fmt.text}</div>
                  <p className="text-[11px] text-muted-foreground mt-1">{fmt.description}</p>
                </div>
                <div className="shrink-0 self-end sm:self-center">
                  <CopyBtn text={fmt.text} label="Copy Title" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "word-character-counter":
    case "word-counter": {
      const wordCount = Number(data.wordCount || 0);
      const charCount = Number(data.charCountWithSpaces || 0);
      const charNoSpaces = Number(data.charCountWithoutSpaces || 0);
      const speakingTime = String(data.speakingTime || "0m 0s");
      const readingMins = Number(data.readingTimeMinutes || 1);
      const limits = (data.limits as {
        youtubeTitle?: { current: number; max: number; status: string; pct: number };
        youtubeDescription?: { current: number; max: number; status: string; pct: number };
      }) || {};
      const topKeywords = Array.isArray(data.topKeywords)
        ? (data.topKeywords as Array<{ word: string; count: number; percentage: number }>)
        : [];

      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Word & Character Counter Breakdown
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live text analytics, speech duration calculation, and YouTube platform length compliance.
            </p>
          </div>

          {Boolean(data.fetchedFromVideo) && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2">
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span>
                <strong>Auto-fetched Video Description from:</strong> {String(data.videoSourceTitle || "")}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
              <div className="text-2xl font-black text-foreground">{wordCount}</div>
              <div className="text-xs text-muted-foreground mt-1 font-semibold">Total Words</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
              <div className="text-2xl font-black text-primary">{charCount}</div>
              <div className="text-xs text-muted-foreground mt-1 font-semibold">Chars (with spaces)</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
              <div className="text-2xl font-black text-foreground">{charNoSpaces}</div>
              <div className="text-xs text-muted-foreground mt-1 font-semibold">Chars (no spaces)</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
              <div className="text-2xl font-black text-amber-500">{speakingTime}</div>
              <div className="text-xs text-muted-foreground mt-1 font-semibold">Speaking Duration</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">YouTube Platform Limit Compliance</h4>
              {limits.youtubeDescription && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">Video Description</span>
                    <span className="text-muted-foreground font-mono">{limits.youtubeDescription.current} / 5,000</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${limits.youtubeDescription.current > 5000 ? "bg-red-500" : "bg-emerald-500"}`}
                      style={{ width: `${Math.min(100, limits.youtubeDescription.pct)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{limits.youtubeDescription.status}</div>
                </div>
              )}

              {limits.youtubeTitle && (
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">Video Title</span>
                    <span className="text-muted-foreground font-mono">{limits.youtubeTitle.current} / 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${limits.youtubeTitle.current > 100 ? "bg-red-500" : limits.youtubeTitle.current > 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                      style={{ width: `${Math.min(100, limits.youtubeTitle.pct)}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-muted-foreground">{limits.youtubeTitle.status}</div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Keyword Frequency</h4>
              {topKeywords.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {topKeywords.map((kw, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/40 text-xs">
                      <span className="font-semibold text-foreground truncate">{kw.word}</span>
                      <span className="text-muted-foreground font-mono text-[11px]">{kw.count}x ({kw.percentage}%)</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground py-4 text-center">No repeated keywords</div>
              )}
              <div className="text-[11px] text-muted-foreground pt-1">
                • Silent reading time estimate: ~{readingMins} min
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
