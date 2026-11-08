import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import ffmpegPath from "ffmpeg-static";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);

// Ensure temp directory exists
const TEMP_DIR = path.join(process.cwd(), ".temp_downloads");
if (!fs.existsSync(TEMP_DIR)) {
  try {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  } catch {}
}

// Resolve ffmpeg binary path reliably across Windows and platforms
function getFfmpegBinary(): string | null {
  const candidates = [
    typeof ffmpegPath === "string" ? ffmpegPath : null,
    path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
  ].filter(Boolean) as string[];

  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      return cand;
    }
  }
  return null;
}

/**
 * Ultra-Reliable Zero-API Video & Audio Downloader with Guaranteed Sound Muxing
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  let videoId = searchParams.get("v") || searchParams.get("videoId") || "";
  const isAudio = searchParams.get("audio") === "true" || searchParams.get("type") === "mp3";
  const rawQuality = searchParams.get("quality") || "1080";
  const quality = rawQuality.replace(/[^0-9]/g, "") || "1080";
  const requestedFormat = searchParams.get("format") || (isAudio ? "mp3" : "mp4");

  // Clean video ID
  videoId = videoId.trim();
  if (!videoId) {
    return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const safeFilePrefix = videoId.replace(/[^a-zA-Z0-9_-]/g, "");
  const ext = isAudio ? (requestedFormat === "m4a" ? "m4a" : "mp3") : "mp4";
  const targetFilePath = path.join(TEMP_DIR, `${safeFilePrefix}_${isAudio ? "audio" : quality}.${ext}`);
  const outTemplate = path.join(TEMP_DIR, `${safeFilePrefix}_${isAudio ? "audio" : quality}.%(ext)s`);

  let lastError = "";

  try {
    // 1. Download & merge with ffmpeg if not already cached
    if (!fs.existsSync(targetFilePath) || fs.statSync(targetFilePath).size === 0) {
      const formatSelection = isAudio
        ? "ba/bestaudio/b/best"
        : `bv*[height<=${quality}]+ba/b[height<=${quality}]/bv*+ba/b/best`;

      const resolvedFfmpeg = getFfmpegBinary();

      const args = [
        "-m",
        "yt_dlp",
        "--remote-components",
        "ejs:github",
        "--js-runtimes",
        "node",
        "--no-playlist",
        "--force-overwrites",
      ];

      if (resolvedFfmpeg) {
        args.push("--ffmpeg-location", resolvedFfmpeg);
      }

      if (isAudio) {
        if (ext === "mp3") {
          args.push(
            "-f",
            formatSelection,
            "-x",
            "--audio-format",
            "mp3",
            "--audio-quality",
            "0",
            "-o",
            outTemplate,
            "--",
            youtubeUrl
          );
        } else {
          args.push(
            "-f",
            formatSelection,
            "-x",
            "--audio-format",
            "m4a",
            "-o",
            outTemplate,
            "--",
            youtubeUrl
          );
        }
      } else {
        args.push(
          "-f",
          formatSelection,
          "--merge-output-format",
          "mp4",
          "-o",
          outTemplate,
          "--",
          youtubeUrl
        );
      }

      await execFileAsync("python", args, { timeout: 180000 });
    }

    // 2. Stream the verified file directly to the client
    if (fs.existsSync(targetFilePath) && fs.statSync(targetFilePath).size > 0) {
      const stat = fs.statSync(targetFilePath);
      const nodeStream = fs.createReadStream(targetFilePath);

      const webStream = new ReadableStream({
        start(controller) {
          nodeStream.on("data", (chunk) => {
            try {
              const buffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
              controller.enqueue(buffer);
            } catch {
              nodeStream.destroy();
            }
          });
          nodeStream.on("end", () => {
            try {
              controller.close();
            } catch {}
          });
          nodeStream.on("error", (err) => {
            try {
              controller.error(err);
            } catch {}
          });
        },
        cancel() {
          nodeStream.destroy();
        },
      });

      const filename = `${safeFilePrefix}.${ext}`;
      const contentType = isAudio ? "audio/mpeg" : "video/mp4";

      return new Response(webStream, {
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(stat.size),
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  } catch (err) {
    lastError = err instanceof Error ? err.message : String(err);
    console.error("Downloader error:", lastError);
  }

  // User-friendly error message
  const isUnavailable =
    lastError.includes("unavailable") ||
    lastError.includes("Private video") ||
    lastError.includes("Video unavailable");

  const errorTitle = isUnavailable
    ? "Video Unavailable or Private"
    : "Video Download Failed";

  const errorDesc = isUnavailable
    ? "This YouTube video is private, removed, or the URL contains a typo. Please verify the URL and try with a valid public video."
    : "Unable to process the video stream. Please check your internet connection or URL and try again.";

  const errorHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${errorTitle} — YouTube Creator Toolkit Pro</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #09090b; color: #f4f4f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
        .card { max-width: 480px; width: 100%; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 36px 28px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .icon { font-size: 44px; margin-bottom: 16px; }
        h1 { font-size: 20px; font-weight: 700; margin: 0 0 12px; color: #f87171; }
        p { color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 28px; }
        .btn { display: inline-block; background: #ef4444; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; transition: opacity 0.2s; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
        .btn:hover { opacity: 0.9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">⚠️</div>
        <h1>${errorTitle}</h1>
        <p>${errorDesc}</p>
        <a href="/tools/youtube-video-downloader" class="btn">Try Another Video</a>
      </div>
    </body>
    </html>
  `;

  return new Response(errorHtml, {
    status: isUnavailable ? 404 : 500,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
