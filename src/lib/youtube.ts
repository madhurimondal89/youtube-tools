/**
 * YouTube Data API v3 Client
 * All API calls go through server-side routes — keys never exposed to client
 */

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

async function ytFetch<T>(
  endpoint: string,
  params: Record<string, string>,
  customKey?: string
): Promise<T> {
  const activeKey = customKey?.trim() || API_KEY;
  if (!activeKey || activeKey.includes("your_youtube_api_key_here")) {
    throw new Error("YouTube API Key is not configured. Please add your key or configure it in Settings.");
  }

  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("key", activeKey);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error?.message || `YouTube API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Video ────────────────────────────────────────────────────────────

export async function getVideoDetails(videoId: string, customKey?: string) {
  return ytFetch<YouTubeVideoListResponse>("videos", {
    part: "snippet,statistics,contentDetails,status,localizations",
    id: videoId,
  }, customKey);
}

export async function getVideosByIds(videoIds: string[], customKey?: string) {
  return ytFetch<YouTubeVideoListResponse>("videos", {
    part: "snippet,statistics,contentDetails",
    id: videoIds.join(","),
  }, customKey);
}

// ── Channel ─────────────────────────────────────────────────────────

export async function getChannelByHandle(handle: string, customKey?: string) {
  return ytFetch<YouTubeChannelListResponse>("channels", {
    part: "snippet,statistics,brandingSettings,contentDetails",
    forHandle: handle.replace("@", ""),
  }, customKey);
}

export async function getChannelById(channelId: string, customKey?: string) {
  return ytFetch<YouTubeChannelListResponse>("channels", {
    part: "snippet,statistics,brandingSettings,contentDetails",
    id: channelId,
  }, customKey);
}

export async function getChannelByUsername(username: string, customKey?: string) {
  return ytFetch<YouTubeChannelListResponse>("channels", {
    part: "snippet,statistics,brandingSettings,contentDetails",
    forUsername: username,
  }, customKey);
}

// ── Playlist ─────────────────────────────────────────────────────────

export async function getPlaylistDetails(playlistId: string, customKey?: string) {
  return ytFetch<YouTubePlaylistListResponse>("playlists", {
    part: "snippet,contentDetails,status",
    id: playlistId,
  }, customKey);
}

export async function getPlaylistItems(playlistId: string, maxResults = "50", pageToken?: string, customKey?: string) {
  const params: Record<string, string> = {
    part: "snippet,contentDetails",
    playlistId,
    maxResults,
  };
  if (pageToken) params.pageToken = pageToken;
  return ytFetch<YouTubePlaylistItemsResponse>("playlistItems", params, customKey);
}

// ── Search ────────────────────────────────────────────────────────────

export async function searchYouTube(
  query: string,
  type: "video" | "channel" | "playlist" = "video",
  maxResults = "10",
  customKey?: string
) {
  return ytFetch<YouTubeSearchResponse>("search", {
    part: "snippet",
    q: query,
    type,
    maxResults,
    order: "relevance",
  }, customKey);
}

// ── Comments ──────────────────────────────────────────────────────────

export async function getVideoComments(videoId: string, maxResults = "100", customKey?: string) {
  return ytFetch<YouTubeCommentThreadsResponse>("commentThreads", {
    part: "snippet",
    videoId,
    maxResults,
    order: "relevance",
  }, customKey);
}

// ── Captions ─────────────────────────────────────────────────────────

export async function getVideoCaptions(videoId: string, customKey?: string) {
  return ytFetch<YouTubeCaptionListResponse>("captions", {
    part: "snippet",
    videoId,
  }, customKey);
}

// ── Types ─────────────────────────────────────────────────────────────

export interface YouTubeThumbnails {
  default?: { url: string; width: number; height: number };
  medium?: { url: string; width: number; height: number };
  high?: { url: string; width: number; height: number };
  standard?: { url: string; width: number; height: number };
  maxres?: { url: string; width: number; height: number };
}

export interface YouTubeVideoSnippet {
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  tags?: string[];
  thumbnails: YouTubeThumbnails;
  categoryId: string;
  defaultLanguage?: string;
  localized: { title: string; description: string };
}

export interface YouTubeVideoStatistics {
  viewCount: string;
  likeCount: string;
  commentCount: string;
  favoriteCount: string;
}

export interface YouTubeVideoContentDetails {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
}

export interface YouTubeVideoItem {
  id: string;
  snippet: YouTubeVideoSnippet;
  statistics: YouTubeVideoStatistics;
  contentDetails: YouTubeVideoContentDetails;
  status: { uploadStatus: string; privacyStatus: string; madeForKids: boolean };
}

export interface YouTubeVideoListResponse {
  items: YouTubeVideoItem[];
  pageInfo: { totalResults: number; resultsPerPage: number };
}

export interface YouTubeChannelSnippet {
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnails: YouTubeThumbnails;
  country?: string;
}

export interface YouTubeChannelStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

export interface YouTubeChannelBrandingSettings {
  channel: {
    title: string;
    description?: string;
    keywords?: string;
    country?: string;
  };
  image?: {
    bannerExternalUrl?: string;
    bannerImageUrl?: string;
  };
}

export interface YouTubeChannelItem {
  id: string;
  snippet: YouTubeChannelSnippet;
  statistics: YouTubeChannelStatistics;
  brandingSettings: YouTubeChannelBrandingSettings;
  contentDetails: { relatedPlaylists: { uploads: string } };
}

export interface YouTubeChannelListResponse {
  items: YouTubeChannelItem[];
}

export interface YouTubePlaylistListResponse {
  items: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: YouTubeThumbnails;
    };
    contentDetails: { itemCount: number };
    status: { privacyStatus: string };
  }>;
}

export interface YouTubePlaylistItemsResponse {
  items: Array<{
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: YouTubeThumbnails;
      resourceId: { videoId: string };
      position: number;
      channelTitle: string;
    };
    contentDetails: { videoId: string; videoPublishedAt: string };
  }>;
  nextPageToken?: string;
  pageInfo: { totalResults: number };
}

export interface YouTubeSearchResponse {
  items: Array<{
    id: { kind: string; videoId?: string; channelId?: string; playlistId?: string };
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: YouTubeThumbnails;
      channelId: string;
    };
  }>;
  nextPageToken?: string;
  pageInfo: { totalResults: number };
}

export interface YouTubeCommentThreadsResponse {
  items: Array<{
    id: string;
    snippet: {
      topLevelComment: {
        snippet: {
          textDisplay: string;
          authorDisplayName: string;
          authorProfileImageUrl: string;
          likeCount: number;
          publishedAt: string;
        };
      };
      totalReplyCount: number;
    };
  }>;
  nextPageToken?: string;
  pageInfo: { totalResults: number };
}

export interface YouTubeCaptionListResponse {
  items: Array<{
    id: string;
    snippet: {
      videoId: string;
      lastUpdated: string;
      trackKind: string;
      language: string;
      name: string;
      audioTrackType: string;
      isCC: boolean;
      isLarge: boolean;
      isEasyReader: boolean;
      isDraft: boolean;
      isAutoSynced: boolean;
      status: string;
    };
  }>;
}
