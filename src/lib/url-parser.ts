/**
 * YouTube URL Parser
 * Parses any YouTube URL format and extracts IDs
 */

export type YouTubeUrlType =
  | "video"
  | "shorts"
  | "clip"
  | "channel"
  | "playlist"
  | "username"
  | "unknown";

export interface ParsedYouTubeUrl {
  type: YouTubeUrlType;
  videoId?: string;
  channelId?: string;
  username?: string;
  playlistId?: string;
  clipId?: string;
  timestamp?: string;
  queryParams?: Record<string, string>;
  raw: string;
  isValid: boolean;
}

export function parseYouTubeUrl(input: string): ParsedYouTubeUrl {
  const raw = input.trim();
  const result: ParsedYouTubeUrl = { type: "unknown", raw, isValid: false };

  if (!raw) return result;

  // ── Direct 11-character video ID ────────────────────────────
  const directIdMatch = raw.match(/^[a-zA-Z0-9_-]{11}$/);
  if (directIdMatch) {
    return { ...result, type: "video", videoId: directIdMatch[0], isValid: true };
  }

  // ── @username ──────────────────────────────────────────────
  const usernameMatch = raw.match(/^@([\w.-]+)$/);
  if (usernameMatch) {
    return { ...result, type: "username", username: usernameMatch[1], isValid: true };
  }

  let url: URL;
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    // Plain text input — treat as search query
    return { ...result, type: "unknown", isValid: false };
  }

  const host = url.hostname.replace("www.", "");
  if (!["youtube.com", "youtu.be", "m.youtube.com", "music.youtube.com"].includes(host)) {
    return result;
  }

  const path = url.pathname;
  const params = url.searchParams;
  const timestamp = params.get("t") || params.get("start") || undefined;

  const queryParams: Record<string, string> = {};
  params.forEach((v, k) => {
    queryParams[k] = v;
  });
  const hasQueryParams = Object.keys(queryParams).length > 0;

  // ── youtu.be short links ───────────────────────────────────
  if (host === "youtu.be") {
    const videoId = path.slice(1).split("?")[0].replace(/[^a-zA-Z0-9_-]/g, "");
    if (videoId) {
      return {
        ...result,
        type: "video",
        videoId,
        timestamp,
        queryParams: hasQueryParams ? queryParams : undefined,
        isValid: true,
      };
    }
  }

  // ── Shorts ─────────────────────────────────────────────────
  const shortsMatch = path.match(/^\/shorts\/([\w-]+)/);
  if (shortsMatch) {
    return {
      ...result,
      type: "shorts",
      videoId: shortsMatch[1],
      timestamp,
      queryParams: hasQueryParams ? queryParams : undefined,
      isValid: true,
    };
  }

  // ── Clips ──────────────────────────────────────────────────
  const clipMatch = path.match(/^\/clip\/([\w-]+)/);
  if (clipMatch) {
    return {
      ...result,
      type: "clip",
      clipId: clipMatch[1],
      queryParams: hasQueryParams ? queryParams : undefined,
      isValid: true,
    };
  }

  // ── Live streams ────────────────────────────────────────────
  const liveMatch = path.match(/^\/live\/([\w-]+)/);
  if (liveMatch) {
    return {
      ...result,
      type: "video",
      videoId: liveMatch[1],
      timestamp,
      queryParams: hasQueryParams ? queryParams : undefined,
      isValid: true,
    };
  }

  // ── Embed links ─────────────────────────────────────────────
  const embedMatch = path.match(/^\/embed\/([\w-]+)/);
  if (embedMatch) {
    return {
      ...result,
      type: "video",
      videoId: embedMatch[1],
      timestamp,
      queryParams: hasQueryParams ? queryParams : undefined,
      isValid: true,
    };
  }

  // ── Watch URL ───────────────────────────────────────────────
  if (path === "/watch") {
    const videoId = params.get("v");
    const playlistId = params.get("list");
    if (videoId) {
      return {
        ...result,
        type: "video",
        videoId,
        playlistId: playlistId ?? undefined,
        timestamp,
        queryParams: hasQueryParams ? queryParams : undefined,
        isValid: true,
      };
    }
    if (playlistId) {
      return {
        ...result,
        type: "playlist",
        playlistId,
        queryParams: hasQueryParams ? queryParams : undefined,
        isValid: true,
      };
    }
  }

  // ── Playlist ────────────────────────────────────────────────
  if (path === "/playlist") {
    const playlistId = params.get("list");
    if (playlistId) {
      return {
        ...result,
        type: "playlist",
        playlistId,
        queryParams: hasQueryParams ? queryParams : undefined,
        isValid: true,
      };
    }
  }

  // ── Channel paths ───────────────────────────────────────────
  const channelMatch = path.match(/^\/(channel)\/(UC[\w-]+)/);
  if (channelMatch) {
    return {
      ...result,
      type: "channel",
      channelId: channelMatch[2],
      queryParams: hasQueryParams ? queryParams : undefined,
      isValid: true,
    };
  }

  const handleMatch = path.match(/^\/@([\w.-]+)/);
  if (handleMatch) {
    return {
      ...result,
      type: "username",
      username: handleMatch[1],
      queryParams: hasQueryParams ? queryParams : undefined,
      isValid: true,
    };
  }

  const legacyUserMatch = path.match(/^\/user\/([\w.-]+)/);
  if (legacyUserMatch) {
    return {
      ...result,
      type: "username",
      username: legacyUserMatch[1],
      queryParams: hasQueryParams ? queryParams : undefined,
      isValid: true,
    };
  }

  // ── Plain channel name /c/... ────────────────────────────────
  const cMatch = path.match(/^\/c\/([\w.-]+)/);
  if (cMatch) {
    return {
      ...result,
      type: "username",
      username: cMatch[1],
      queryParams: hasQueryParams ? queryParams : undefined,
      isValid: true,
    };
  }

  return result;
}

export function getVideoIdFromUrl(url: string): string | null {
  const parsed = parseYouTubeUrl(url);
  return parsed.videoId ?? null;
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const h = parseInt(match[1] || "0");
  const m = parseInt(match[2] || "0");
  const s = parseInt(match[3] || "0");
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
