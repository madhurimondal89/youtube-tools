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

// Resolve ffmpeg binary path reliably across Alpine, Linux, and Windows
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

// Resolve Python runtime across Docker venv, Alpine, and host environments
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

const DEFAULT_COOKIE_DATA = `# Netscape HTTP Cookie File
# https://curl.haxx.se/rfc/cookie_spec.html
# This is a generated file! Do not edit.

.youtube.com	TRUE	/	FALSE	1794326774	_gcl_au	1.1.1546078568.1786550774
.youtube.com	TRUE	/	TRUE	1825263391	__Secure-3PAPISID	nLXHAj5yEIPOqFNM/AiF5e6XZY-4TQGRfb
.youtube.com	TRUE	/	TRUE	1805901505	NID	CvkBCAESqwEBOxGDSHi7995IovgJr87gYipgckNUnCkA99PqOuSbn9PQFz8qecfoDh935-XrW5mh052OVHzG_om6ZRKV1Xt8XFYTNy5-aXZxtgItNUOr0qe36LxL7eHtN9NJqtfnKRHLQCY5weitiOdVRjySFA_Ocpz_Om8POkSJfQpMvtJrPmTs2NhzCneAEURBWVX-t5C8WI2aAyJQuDD5EFXg-4YWgNfWHfG3zu-OuwQoATJFAdKsB8-251PvxttLedWhrQDd831nHKahEyC_PO5mx5zQPLDMW3zcgD8MTkrj00ZBMFx-RuasNf8PKzUtb5lXyOoTaIgD
.youtube.com	TRUE	/	TRUE	1821626305	__Secure-1PSIDTS	sidts-CjUBkldj_582acpoAWTJWWH-7GKlpsqQf2hmzv9p4Yx23arVRaVOL0Nw4uhPnk72S6EASo3VTRAA
.youtube.com	TRUE	/	TRUE	1821626305	__Secure-3PSIDTS	sidts-CjUBkldj_582acpoAWTJWWH-7GKlpsqQf2hmzv9p4Yx23arVRaVOL0Nw4uhPnk72S6EASo3VTRAA
.youtube.com	TRUE	/	TRUE	1825263391	__Secure-3PSID	g.a000DAnTVwkniJ5byqkz7lfxJgtPAgAp9zR1HQK_ZUnNOtxQSjx3xmEHuxKsaC3Ur8gWEuDwMgACgYKAQgSARYSFQHGX2MibV_8HslAUjZDMvTbQU7pVhoVAUF8yKo7GJsuTShFezpGEvhxyZBI0076
.youtube.com	TRUE	/	TRUE	1806658802	__Secure-BUCKET	CKMF
.youtube.com	TRUE	/	TRUE	1828703629	PREF	f7=100&has_user_changed_default_autoplay_mode=true&tz=Asia.Calcutta&repeat=NONE&autoplay=false&f5=20000
.youtube.com	TRUE	/	TRUE	1825684439	__Secure-3PSIDCC	APD_SKHbwD8KLIxP2I1dj1Trhkxqec3gJau7EaPCEc0oGpCa7JG-BYLI6NZSY_XW6-zdIvjv_gs
.youtube.com	TRUE	/	TRUE	1809695626	VISITOR_INFO1_LIVE	wVbciga6vN4
.youtube.com	TRUE	/	TRUE	1809695626	VISITOR_PRIVACY_METADATA	CgJJThIEGgAgRA%3D%3D
.youtube.com	TRUE	/	TRUE	1809693903	__Secure-YNID	CuwBCAUSngEBDB6PDCUaxMba9ycxCqUb_8KCiXU9qT7V89AY6lUcr-vVUx7qivR8fS8Zu7XASh2D2zUBJCYzjV07oe2c9Uf8V_RVX1ZUaHhYrqpTsQ8Pef-475ioKqmRqcnIjcyzs70hDPsnyclCUMqzEpxG4HVSAZPfmnjsTW7gfSUr1YUb08Uxn7DuCJwzM8-SrSzb6fEmjTpUOObtfD8JjsLQrygFMkUBHFj1amsRz5B72yrriYbOdxvZKyQnnlQdJhOcKki6GCiVj0OtXKmsJ8Dtn9Wu1sX44ccG9FKCE13yt5mK2f5YxcrD5wQ
.youtube.com	TRUE	/	TRUE	0	YSC	yFh8FSrwrto
.youtube.com	TRUE	/	TRUE	1809693903	__Secure-ROLLOUT_TOKEN	CKfHpubltYtHEK_3pqy4m5YDGJidq7az-JcD
`;

// Guaranteed cookies support: checks disk, env, and falls back to embedded session cookies
function getCookieArgs(): string[] {
  const candidatePaths = [
    path.join(TEMP_DIR, "yt_cookies.txt"),
    "/app/cookies.txt",
    path.join(process.cwd(), "cookies.txt"),
    path.join(process.cwd(), "..", "cookies.txt"),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p) && fs.statSync(p).size > 50) {
      return ["--cookies", p];
    }
  }

  // Ensure embedded cookie file is written to TEMP_DIR so yt-dlp always has it
  const tmpCookie = path.join(TEMP_DIR, "yt_cookies.txt");
  try {
    const dataToWrite = process.env.YOUTUBE_COOKIES || DEFAULT_COOKIE_DATA;
    fs.writeFileSync(tmpCookie, dataToWrite.trim() + "\n", "utf-8");
    return ["--cookies", tmpCookie];
  } catch (e) {
    console.warn("Could not write cookie fallback:", e);
  }

  return [];
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
    let existingFile = targetFilePath;
    const prefix = `${safeFilePrefix}_${isAudio ? "audio" : quality}.`;

    if (!fs.existsSync(existingFile) || fs.statSync(existingFile).size === 0) {
      // Check if file exists with another extension in temp
      const match = fs.existsSync(TEMP_DIR)
        ? fs.readdirSync(TEMP_DIR).find((f) => f.startsWith(prefix) && !f.endsWith(".part") && !f.endsWith(".ytdl"))
        : null;

      if (match) {
        existingFile = path.join(TEMP_DIR, match);
      }
    }

    if (!fs.existsSync(existingFile) || fs.statSync(existingFile).size === 0) {
      // Support both horizontal 16:9 and vertical 9:16 Shorts
      const formatSelection = isAudio
        ? "ba/bestaudio/b/best"
        : `bv*[height<=${quality}]+ba/bv*[width<=${quality}]+ba/b[height<=${quality}]/b[width<=${quality}]/bv*+ba/b/best`;

      const resolvedFfmpeg = getFfmpegBinary();
      const pythonBin = getPythonBinary();

      const args = [
        "-m",
        "yt_dlp",
        "--extractor-args",
        "youtube:player_client=visionos",
        "--remote-components",
        "ejs:github",
        "--js-runtimes",
        "quickjs,node:/usr/local/bin/node,node",
        "--no-playlist",
        "--force-overwrites",
      ];

      if (resolvedFfmpeg) {
        args.push("--ffmpeg-location", resolvedFfmpeg);
      }

      const cookieArgs = getCookieArgs();
      if (cookieArgs.length > 0) {
        args.push(...cookieArgs);
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

      try {
        await execFileAsync(pythonBin, args, { timeout: 240000 });
      } catch (execErr: unknown) {
        const cmdErr = execErr as { stderr?: string; stdout?: string; message?: string };
        const detailedErr = cmdErr.stderr || cmdErr.stdout || cmdErr.message || String(execErr);
        console.error("yt-dlp primary run failed:", detailedErr);

        // Fallback: retry with player_client=android,ios if EJS or bot verification blocked
        const fallbackArgs = [
          "-m",
          "yt_dlp",
          "--extractor-args",
          "youtube:player_client=visionos",
          "--no-playlist",
          "--force-overwrites",
        ];
        if (resolvedFfmpeg) fallbackArgs.push("--ffmpeg-location", resolvedFfmpeg);
        if (cookieArgs.length > 0) fallbackArgs.push(...cookieArgs);

        if (isAudio) {
          fallbackArgs.push("-f", "ba/b", "-x", "--audio-format", ext, "-o", outTemplate, "--", youtubeUrl);
        } else {
          fallbackArgs.push("-f", "b/best", "--merge-output-format", "mp4", "-o", outTemplate, "--", youtubeUrl);
        }

        console.log("Retrying yt-dlp with mobile extractor fallback...");
        await execFileAsync(pythonBin, fallbackArgs, { timeout: 240000 });
      }
    }

    // Locate downloaded file (handle .mp4, .webm, .mkv, .mp3, etc.)
    let actualFile = targetFilePath;
    if (!fs.existsSync(actualFile) || fs.statSync(actualFile).size === 0) {
      const match = fs.readdirSync(TEMP_DIR).find((f) => f.startsWith(prefix) && !f.endsWith(".part") && !f.endsWith(".ytdl"));
      if (match) {
        actualFile = path.join(TEMP_DIR, match);
      }
    }

    // 2. Stream the verified file directly to the client
    if (fs.existsSync(actualFile) && fs.statSync(actualFile).size > 0) {
      const stat = fs.statSync(actualFile);
      const nodeStream = fs.createReadStream(actualFile);

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

      const actualExt = path.extname(actualFile).replace(".", "") || ext;
      const filename = `${safeFilePrefix}.${actualExt}`;
      const contentType = isAudio
        ? actualExt === "m4a"
          ? "audio/mp4"
          : "audio/mpeg"
        : `video/${actualExt === "webm" ? "webm" : "mp4"}`;

      return new Response(webStream, {
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(stat.size),
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  } catch (err: unknown) {
    const cmdErr = err as { stderr?: string; stdout?: string; message?: string };
    lastError = cmdErr.stderr || cmdErr.stdout || cmdErr.message || String(err);
    console.error("Downloader error:", lastError);
  }

  // Return JSON for fetch/XHR requests from the UI, and HTML only for direct address bar navigation
  const isDirectBrowserNav = req.headers.get("sec-fetch-dest") === "document";
  const acceptsJson = !isDirectBrowserNav || req.headers.get("accept")?.includes("application/json");

  const isUnavailable =
    lastError.includes("unavailable") ||
    lastError.includes("Private video") ||
    lastError.includes("Video unavailable");

  const cleanErrorMessage = isUnavailable
    ? "This YouTube video is private or unavailable."
    : lastError
    ? `Stream processing error: ${lastError.replace(/\r?\n+/g, " ").trim().slice(0, 300)}`
    : "Unable to process video stream. Please try again.";

  if (acceptsJson) {
    return NextResponse.json({ error: cleanErrorMessage }, { status: isUnavailable ? 404 : 500 });
  }

  const errorTitle = isUnavailable ? "Video Unavailable or Private" : "Video Download Failed";

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
        p { color: #a1a1aa; font-size: 14px; line-height: 1.6; margin: 0 0 28px; word-break: break-word; }
        .btn { display: inline-block; background: #ef4444; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; transition: opacity 0.2s; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }
        .btn:hover { opacity: 0.9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">⚠️</div>
        <h1>${errorTitle}</h1>
        <p>${cleanErrorMessage}</p>
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
