import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import ffmpegPath from "ffmpeg-static";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

const execFileAsync = promisify(execFile);

const TEMP_DIR = path.join(process.cwd(), ".temp_downloads");
if (!fs.existsSync(TEMP_DIR)) {
  try {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  } catch {}
}

function getFfmpegBinary(): string | null {
  const candidates = [
    typeof ffmpegPath === "string" ? ffmpegPath : null,
    path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
    "/usr/bin/ffmpeg",
    "/usr/local/bin/ffmpeg",
  ].filter(Boolean) as string[];

  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      return cand;
    }
  }
  return "ffmpeg";
}

function getPythonBinary(): string {
  const candidates = [
    "/opt/venv/bin/python3",
    "/opt/venv/bin/python",
    "/usr/local/bin/python",
    "/usr/bin/python3",
    "/usr/bin/python",
  ];
  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      return cand;
    }
  }
  return process.platform === "win32" ? "python" : "python3";
}

function formatSeconds(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Endpoint to clip, trim, and format video segments (including 9:16 vertical Shorts)
 * Usage: /api/clip-download?v=VIDEO_ID&start=15&end=65&vertical=true
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  let videoId = searchParams.get("v") || searchParams.get("videoId") || "";
  const startSec = Math.max(0, parseFloat(searchParams.get("start") || "0"));
  const endSec = Math.max(startSec + 5, parseFloat(searchParams.get("end") || "60"));
  const isVertical = searchParams.get("vertical") === "true";
  const duration = Math.min(300, endSec - startSec); // Max 5 mins per clip

  videoId = videoId.trim();
  if (!videoId) {
    return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const safePrefix = videoId.replace(/[^a-zA-Z0-9_-]/g, "");
  const baseFilename = `${safePrefix}_clip_${Math.round(startSec)}_${Math.round(endSec)}${isVertical ? "_vertical" : ""}.mp4`;
  const targetFilePath = path.join(TEMP_DIR, baseFilename);

  const ffmpegBin = getFfmpegBinary();
  if (!ffmpegBin) {
    return NextResponse.json({ error: "FFmpeg binary unavailable" }, { status: 500 });
  }

  try {
    if (!fs.existsSync(targetFilePath) || fs.statSync(targetFilePath).size === 0) {
      // 1. Download source section
      const rawSourcePath = path.join(TEMP_DIR, `${safePrefix}_source.mp4`);
      
      if (!fs.existsSync(rawSourcePath) || fs.statSync(rawSourcePath).size === 0) {
        const ytdlArgs = [
          "-m",
          "yt_dlp",
          "--extractor-args",
          "youtube:player_client=visionos,web,android",
          "--remote-components",
          "ejs:github",
          "--js-runtimes",
          "node",
          "--no-playlist",
          "--force-overwrites",
          "--ffmpeg-location",
          ffmpegBin,
          "-f",
          "bv*[height<=1080]+ba/b[height<=1080]/bv*+ba/b/best",
          "--merge-output-format",
          "mp4",
          "-o",
          rawSourcePath,
          "--",
          youtubeUrl,
        ];

        await execFileAsync(getPythonBinary(), ytdlArgs, { timeout: 180000 });
      }

      // 2. Cut & optionally crop to 9:16 vertical with ffmpeg
      const startTimeFormatted = formatSeconds(startSec);
      const ffmpegArgs = [
        "-ss",
        startTimeFormatted,
        "-i",
        rawSourcePath,
        "-t",
        String(duration),
      ];

      if (isVertical) {
        // Center crop to 9:16 (standard Shorts/TikTok aspect ratio)
        ffmpegArgs.push(
          "-vf",
          "crop=ih*(9/16):ih,scale=1080:1920:flags=lanczos,setsar=1",
          "-c:v",
          "libx264",
          "-preset",
          "fast",
          "-crf",
          "23",
          "-c:a",
          "aac",
          "-b:a",
          "192k",
          "-movflags",
          "+faststart",
          "-y",
          targetFilePath
        );
      } else {
        ffmpegArgs.push(
          "-c:v",
          "libx264",
          "-preset",
          "fast",
          "-crf",
          "22",
          "-c:a",
          "aac",
          "-b:a",
          "192k",
          "-movflags",
          "+faststart",
          "-y",
          targetFilePath
        );
      }

      await execFileAsync(ffmpegBin, ffmpegArgs, { timeout: 120000 });
    }

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

      return new Response(webStream, {
        headers: {
          "Content-Type": "video/mp4",
          "Content-Length": String(stat.size),
          "Content-Disposition": `attachment; filename="${baseFilename}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    return NextResponse.json({ error: "Failed to render video clip" }, { status: 500 });
  } catch (err) {
    console.error("Clip download error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Clip generation failed" },
      { status: 500 }
    );
  }
}
