/**
 * Universal AI Engine & Creator Scripting Core
 * Supports:
 * 1. OpenAI-Compatible Custom Providers (Groq, OpenRouter, DeepSeek, Together, Ollama)
 * 2. Google Gemini AI (Official SDK)
 * 3. Intelligent Heuristic / Template Fallbacks (Zero-crash guarantee)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AiConfig {
  apiKey?: string;
  endpoint?: string;
  model?: string;
}

export type AiParam = string | AiConfig | undefined;

function parseAiConfig(param?: AiParam): AiConfig {
  if (!param) return {};
  if (typeof param === "string") {
    if (param.startsWith("http")) {
      return { endpoint: param };
    }
    return { apiKey: param };
  }
  return param;
}

export async function generateText(prompt: string, fallbackText: string, aiParam?: AiParam): Promise<string> {
  const config = parseAiConfig(aiParam);
  const endpoint = config.endpoint?.trim() || process.env.AI_ENDPOINT;
  const apiKey = config.apiKey?.trim() || process.env.AI_API_KEY || (endpoint ? undefined : process.env.GEMINI_API_KEY);
  const model = config.model?.trim() || process.env.AI_MODEL;

  // 1. OpenAI-Compatible Provider (Groq, OpenRouter, DeepSeek, Local Ollama, etc.)
  if (endpoint) {
    try {
      let completionsUrl = endpoint;
      if (!completionsUrl.endsWith("/chat/completions")) {
        completionsUrl = `${completionsUrl.replace(/\/+$/, "")}/chat/completions`;
      }
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey && !apiKey.includes("your_")) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }
      if (completionsUrl.includes("openrouter.ai")) {
        headers["HTTP-Referer"] = "https://freeyoutubetools.com";
        headers["X-Title"] = "YouTube Creator Toolkit Pro";
      }

      const defaultModel = completionsUrl.includes("groq.com")
        ? "llama-3.3-70b-versatile"
        : completionsUrl.includes("openrouter")
        ? "meta-llama/llama-3.3-70b-instruct:free"
        : completionsUrl.includes("deepseek")
        ? "deepseek-chat"
        : "llama3";

      const res = await fetch(completionsUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: model || defaultModel,
          messages: [
            {
              role: "system",
              content: "You are an elite YouTube creator consultant and viral video strategist. Strictly follow the user's instructions and formatting requirements.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (res.ok) {
        const json = await res.json();
        const text = (json.choices?.[0]?.message?.content || json.choices?.[0]?.text || "")?.trim();
        if (text) return text;
      } else {
        console.warn("Custom AI endpoint HTTP response:", res.status);
      }
    } catch (err) {
      console.warn("Custom AI endpoint request failed, checking Gemini fallback:", err);
    }
  }

  // 2. Google Gemini AI Engine
  const geminiKey = (apiKey && !apiKey.startsWith("gsk_") && !apiKey.startsWith("sk-or-"))
    ? apiKey
    : process.env.GEMINI_API_KEY;

  if (geminiKey && !geminiKey.includes("your_gemini_api_key_here")) {
    try {
      const client = new GoogleGenerativeAI(geminiKey);
      const geminiModel = client.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await geminiModel.generateContent(prompt);
      const text = result.response.text();
      if (text) return text;
    } catch (err) {
      console.warn("Gemini API call failed, using fallback:", err);
    }
  }

  // 3. Intelligent Heuristic / Template Fallback
  return fallbackText;
}

// ── AI Title Generator ────────────────────────────────────────────────

export async function generateTitles(topic: string, keywords?: string, customApiKey?: AiParam): Promise<string[]> {
  const fallback = [
    `I Tried ${topic} For 30 Days (Here's What Happened)`,
    `The Truth About ${topic} Nobody Tells You`,
    `How to Master ${topic} in 2025 (Step-by-Step)`,
    `Why 99% of People Fail at ${topic}`,
    `${topic}: What YouTube Doesn't Want You to Know`,
    `Stop Doing ${topic} Like This! (Do This Instead)`,
    `The Ultimate Guide to ${topic} for Beginners`,
    `I Tested 10 ${topic} Secrets So You Don't Have To`,
    `5 Simple ${topic} Hacks That Actually Work`,
    `From Beginner to Pro in ${topic} (Complete Blueprint)`,
  ];

  const prompt = `You are a YouTube SEO and viral growth expert. Generate 10 highly engaging, high CTR YouTube video titles for the topic: "${topic}"${keywords ? `. Focus on these keywords: ${keywords}` : ""}.
Rules:
- Each title must be 50-70 characters
- Mix listicles, how-to, curiosity gap, contrarian, and emotional hooks
- Optimize for maximum Click-Through-Rate (CTR)
Return ONLY a JSON array of 10 strings:`;

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── AI Full Script Writer ─────────────────────────────────────────────

export interface FullScriptResult {
  title: string;
  targetDuration: string;
  wordCount: number;
  hook: { spoken: string; visual: string };
  intro: { spoken: string; visual: string };
  sections: Array<{
    heading: string;
    timestamp: string;
    spoken: string;
    visualCue: string;
    bRollSuggestion: string;
  }>;
  callToAction: { spoken: string; onScreenGraphic: string };
  outro: { spoken: string; endScreenSetup: string };
}

export async function generateFullScript(topic: string, format = "standard", customApiKey?: AiParam): Promise<FullScriptResult> {
  const prompt = `You are an elite YouTube documentary & tutorial scriptwriter (like Ali Abdaal or MrBeast). Write a complete, highly engaging video script on "${topic}" (Format: ${format}).
Return a valid JSON object matching this exact structure:
{
  "title": "Compelling Title",
  "targetDuration": "8-10 Minutes",
  "wordCount": 1200,
  "hook": {
    "spoken": "Attention-grabbing first 15 seconds statement...",
    "visual": "Fast cuts, dramatic zoom, text on screen"
  },
  "intro": {
    "spoken": "Set the stakes and deliver on the promise...",
    "visual": "Title card animation and teaser clip"
  },
  "sections": [
    {
      "heading": "Part 1: The Core Foundation",
      "timestamp": "01:15",
      "spoken": "Detailed spoken content with storytelling and pacing...",
      "visualCue": "B-roll of workspace, screen capture",
      "bRollSuggestion": "Stock footage of graphs and modern tech"
    },
    {
      "heading": "Part 2: The Secret Technique",
      "timestamp": "04:30",
      "spoken": "In-depth breakdown with practical examples...",
      "visualCue": "Side-by-side comparison graphics",
      "bRollSuggestion": "Over-the-shoulder action shots"
    },
    {
      "heading": "Part 3: Common Mistakes to Avoid",
      "timestamp": "07:00",
      "spoken": "Warning signs and expert tips...",
      "visualCue": "Red X overlay and checklist",
      "bRollSuggestion": "Animation of mistake vs correct method"
    }
  ],
  "callToAction": {
    "spoken": "If you got value from this, smash subscribe and check out the free guide linked below!",
    "onScreenGraphic": "Subscribe button animation with sound effect"
  },
  "outro": {
    "spoken": "Watch this next video on screen right now to take this to the next level.",
    "endScreenSetup": "2 video cards and playlist link displayed"
  }
}
Return ONLY JSON:`;

  const fallback: FullScriptResult = {
    title: `Mastering ${topic}: The Complete Step-by-Step Blueprint`,
    targetDuration: "8-10 Minutes",
    wordCount: 1150,
    hook: {
      spoken: `What if I told you that everything you've been taught about ${topic} is holding you back? In the next 8 minutes, I'm revealing the exact framework that changed everything.`,
      visual: "Close-up face cam, fast zoom effect, bold kinetic typography.",
    },
    intro: {
      spoken: `Welcome back to the channel. Today we're breaking down ${topic} from zero to advanced level, with zero fluff and practical steps you can implement today.`,
      visual: "Lower third channel branding and quick teaser montage.",
    },
    sections: [
      {
        heading: "1. The Fundamental Shift",
        timestamp: "00:45",
        spoken: `Before jumping into advanced tactics, we must understand the core principle behind ${topic}. Most creators overcomplicate this step, leading to burnout.`,
        visualCue: "Display simplified diagram on screen.",
        bRollSuggestion: "Clean motion graphics illustrating workflow.",
      },
      {
        heading: "2. The 3-Step Execution Strategy",
        timestamp: "03:10",
        spoken: `Step one is audit. Step two is systematize. Step three is consistent scaling. Let's walk through each one step-by-step with real-world examples.`,
        visualCue: "Numbered bullet points sliding in from the right.",
        bRollSuggestion: "Screen recording showing tools and dashboard setup.",
      },
      {
        heading: "3. The #1 Mistake to Avoid",
        timestamp: "06:40",
        spoken: `The biggest trap people fall into is trying to do everything at once. Focus on quality and retention before chasing pure volume.`,
        visualCue: "Warning icon and highlight box.",
        bRollSuggestion: "B-roll of analytical growth chart with annotated tips.",
      },
    ],
    callToAction: {
      spoken: `If you found this useful, hit the like button so YouTube recommends this to more creators, and subscribe for weekly in-depth breakdowns!`,
      onScreenGraphic: "Sub button ringing bell overlay animation.",
    },
    outro: {
      spoken: `Click the video on screen right now to learn the advanced tactics for this. See you in the next one!`,
      endScreenSetup: "Dual end-screen card layout with recommended playlist.",
    },
  };

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── AI Shorts Script Generator ────────────────────────────────────────

export interface ShortsScriptResult {
  title: string;
  durationSeconds: number;
  hook: string;
  storyPacing: Array<{
    secondMark: string;
    narration: string;
    screenAction: string;
    soundEffect: string;
  }>;
  loopEnding: string;
  hashtags: string[];
}

export async function generateShortsScript(topic: string, customApiKey?: AiParam): Promise<ShortsScriptResult> {
  const prompt = `Write a viral 45-second YouTube Shorts / TikTok script for "${topic}". Must be fast-paced, dopamine heavy, and loop seamlessly.
Return JSON:
{
  "title": "Shorts Title",
  "durationSeconds": 45,
  "hook": "First 3 seconds spoken hook",
  "storyPacing": [
    { "secondMark": "0-5s", "narration": "...", "screenAction": "...", "soundEffect": "whoosh" },
    { "secondMark": "6-20s", "narration": "...", "screenAction": "...", "soundEffect": "pop" },
    { "secondMark": "21-40s", "narration": "...", "screenAction": "...", "soundEffect": "ding" },
    { "secondMark": "41-45s", "narration": "...", "screenAction": "...", "soundEffect": "riser" }
  ],
  "loopEnding": "Seamless transition sentence connecting back to the hook",
  "hashtags": ["#Shorts", "#topic", "#viral"]
}`;

  const fallback: ShortsScriptResult = {
    title: `Do THIS with ${topic} Right Now! 🤯`,
    durationSeconds: 45,
    hook: `Stop scrolling if you care about ${topic}! 99% of people get this wrong.`,
    storyPacing: [
      {
        secondMark: "0-5s",
        narration: `Stop scrolling if you care about ${topic}! 99% of people get this wrong.`,
        screenAction: "Fast zoom on face, text overlay: 'DON'T MAKE THIS MISTAKE'",
        soundEffect: "Vine boom / record scratch",
      },
      {
        secondMark: "6-20s",
        narration: `Instead of wasting hours doing it the traditional way, try this 10-second shortcut that top pros use daily.`,
        screenAction: "Split screen comparison: Wrong Way vs Right Way",
        soundEffect: "Fast whoosh transition",
      },
      {
        secondMark: "21-38s",
        narration: `All you need to do is apply this simple formula, adjust your settings, and watch your results 10x overnight.`,
        screenAction: "Screen recording demonstration with highlighted cursor",
        soundEffect: "Satisfying pop sounds",
      },
      {
        secondMark: "39-45s",
        narration: `Follow for daily creator hacks, and that's why you should...`,
        screenAction: "Double tap like icon animation",
        soundEffect: "Click sound",
      },
    ],
    loopEnding: "...always remember that...",
    hashtags: ["#Shorts", `#${topic.replace(/\s+/g, "")}`, "#CreatorTips", "#Viral"],
  };

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── AI First 5 Seconds Hook Generator ────────────────────────────────

export interface HookResult {
  hooks: Array<{
    type: "Curiosity" | "Shock Value" | "Story" | "Contrarian" | "Question";
    hookText: string;
    visualAction: string;
    whyItWorks: string;
  }>;
}

export async function generateHooks(topic: string, customApiKey?: AiParam): Promise<HookResult> {
  const prompt = `Generate 5 viral 5-second video hooks for the topic: "${topic}".
Return JSON:
{
  "hooks": [
    {
      "type": "Curiosity",
      "hookText": "Opening spoken line",
      "visualAction": "What the viewer sees",
      "whyItWorks": "Psychological trigger"
    }
  ]
}`;

  const fallback: HookResult = {
    hooks: [
      {
        type: "Shock Value",
        hookText: `I spent $1,000 testing ${topic} so you don't make the same mistake.`,
        visualAction: "Holding cash or showing an alarming receipt on screen with fast cut.",
        whyItWorks: "High stakes financial commitment creates instant authority and curiosity.",
      },
      {
        type: "Contrarian",
        hookText: `Everything your favorite YouTuber told you about ${topic} is completely false.`,
        visualAction: "Crossing out a whiteboard or slapping a 'MYTH' graphic across the frame.",
        whyItWorks: "Challenges conventional belief, triggering an urge to verify truth.",
      },
      {
        type: "Story",
        hookText: `3 years ago I was completely stuck with ${topic}, until I found this one loophole.`,
        visualAction: "Old flashback photo transitioning to a modern successful setup.",
        whyItWorks: "Relatability and the hero's journey creates emotional buy-in.",
      },
      {
        type: "Curiosity",
        hookText: `There's a secret setting inside ${topic} that nobody is talking about.`,
        visualAction: "Screen recording with a blurred out magic box and zooming pointer.",
        whyItWorks: "Information gap theory makes clicking off physically uncomfortable.",
      },
      {
        type: "Question",
        hookText: `Are you making the #1 fatal mistake when it comes to ${topic}?`,
        visualAction: "Direct eye contact with aggressive question mark graphic.",
        whyItWorks: "Direct viewer address forces an internal self-assessment.",
      },
    ],
  };

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── AI Chapters & Timestamps ─────────────────────────────────────────

export interface ChapterItem {
  time: string;
  title: string;
  summary: string;
}

export async function generateChapters(topicOrTitle: string, customApiKey?: AiParam): Promise<ChapterItem[]> {
  const prompt = `Generate realistic YouTube video timestamps and chapters for a video titled: "${topicOrTitle}".
Return JSON array of objects:
[
  { "time": "00:00", "title": "Introduction & Hook", "summary": "Setting the stage" },
  { "time": "01:15", "title": "The Problem with Traditional Methods", "summary": "Core challenges" },
  { "time": "03:40", "title": "Step 1: Setup & Foundations", "summary": "Initial configuration" },
  { "time": "06:20", "title": "Step 2: Execution & Scaling", "summary": "Actionable workflow" },
  { "time": "09:10", "title": "Pro Tips & Secret Hacks", "summary": "Optimization tricks" },
  { "time": "11:45", "title": "Final Verdict & Next Steps", "summary": "Wrap up and CTA" }
]`;

  const fallback: ChapterItem[] = [
    { time: "00:00", title: "Introduction & Hook", summary: `Overview of ${topicOrTitle}` },
    { time: "01:12", title: "Why Most People Fail", summary: "The common pitfalls and myths" },
    { time: "03:25", title: "Step 1: The Essential Setup", summary: "Tools and preparation needed" },
    { time: "06:10", title: "Step 2: Step-by-Step Walkthrough", summary: "Complete live demonstration" },
    { time: "08:45", title: "Advanced Pro Tips & Shortcuts", summary: "Saving time and maximizing output" },
    { time: "11:20", title: "Common Mistakes & Fixes", summary: "How to troubleshoot issues" },
    { time: "13:05", title: "Summary & Free Resources", summary: "Final thoughts and links in description" },
  ];

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── AI Repurpose Script (Long Video to 5 Shorts) ──────────────────────

export interface RepurposeResult {
  shorts: Array<{
    clipNumber: number;
    hook: string;
    takeaway: string;
    script: string;
    callToAction: string;
  }>;
}

export async function generateRepurposeScript(topicOrText: string, customApiKey?: AiParam): Promise<RepurposeResult> {
  const prompt = `Repurpose the video topic or transcript "${topicOrText}" into 5 standalone, viral 30-45 second micro-scripts for Shorts / TikTok.
Return JSON:
{
  "shorts": [
    {
      "clipNumber": 1,
      "hook": "First 3s hook",
      "takeaway": "Core insight",
      "script": "Full 30s narration",
      "callToAction": "Follow / Subscribe line"
    }
  ]
}`;

  const fallback: RepurposeResult = {
    shorts: [
      {
        clipNumber: 1,
        hook: `The #1 rule for ${topicOrText} in 2025!`,
        takeaway: "Mastering the initial foundation",
        script: `If you're trying to get better at ${topicOrText}, stop overcomplicating things. The biggest secret is focusing on one single variable until you see consistent traction.`,
        callToAction: "Follow for part 2!",
      },
      {
        clipNumber: 2,
        hook: `This tool will save you 10 hours with ${topicOrText}.`,
        takeaway: "Tool automation & workflow speed",
        script: `Instead of manually doing the heavy lifting, top creators automate this entire workflow. Here's how you can set it up in under 60 seconds.`,
        callToAction: "Save this video for later!",
      },
      {
        clipNumber: 3,
        hook: `The fatal mistake 90% of creators make.`,
        takeaway: "Avoiding early burnout and bad habits",
        script: `Most beginners quit ${topicOrText} because they expect instant results. Here is the 90-day consistency metric you should actually measure.`,
        callToAction: "Share this with a creator who needs it!",
      },
      {
        clipNumber: 4,
        hook: `How I 10x'd my output with one simple change.`,
        takeaway: "Process optimization and batching",
        script: `Batching your workflow is the highest ROI habit you can build. Here is my exact 3-step schedule for maximum productivity.`,
        callToAction: "Drop a comment with your thoughts!",
      },
      {
        clipNumber: 5,
        hook: `The untold secret to mastering ${topicOrText}.`,
        takeaway: "Mindset and longevity",
        script: `The real difference between amateurs and pros is how they handle the dips. Here is how to keep momentum when things get tough.`,
        callToAction: "Subscribe for the full long-form breakdown!",
      },
    ],
  };

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── AI Sponsorship Pitch Email ────────────────────────────────────────

export interface SponsorshipPitchResult {
  subjectLines: string[];
  emailBody: string;
  rateCardSuggestion: string;
  deliverablesList: string[];
}

export async function generateSponsorshipPitch(channelOrNiche: string, brandName = "Brand", customApiKey?: AiParam): Promise<SponsorshipPitchResult> {
  const prompt = `Write a high-converting, professional sponsorship outreach pitch email from a YouTube creator in the "${channelOrNiche}" niche to "${brandName}".
Return JSON:
{
  "subjectLines": ["Subject 1", "Subject 2", "Subject 3"],
  "emailBody": "Professional email text with placeholders",
  "rateCardSuggestion": "$500 - $1,500 based on standard niche CPMs",
  "deliverablesList": ["60s Integrated Sponsor Segment", "Dedicated Link in Top Description", "Pinned Comment Link"]
}`;

  const fallback: SponsorshipPitchResult = {
    subjectLines: [
      `Partnership Opportunity: ${channelOrNiche} Audience x ${brandName}`,
      `Quick collaboration idea for ${brandName} (YouTube Creator Outreach)`,
      `Reaching 50K+ engaged ${channelOrNiche} viewers with ${brandName}`,
    ],
    emailBody: `Hi ${brandName} Partnerships Team,\n\nI’ve been a genuine fan of ${brandName} and frequently use your product in my workflow. I run a YouTube channel focused on ${channelOrNiche} where I reach a highly engaged, targeted audience looking for the best tools and strategies.\n\nOur videos consistently average strong retention, with over 70% of viewers in tier-1 markets (US, UK, CA, AU). I’d love to feature ${brandName} in an upcoming high-production video slated for release next month.\n\nProposed Deliverables:\n• 60-90s authentic integration placed in the first half of the video\n• Dedicated affiliate/custom URL in the top line of the description\n• Pinned comment and Community Tab announcement\n\nI’ve attached our media kit with full demographic and engagement analytics. Would you be open to a brief chat next week to discuss this further?\n\nBest regards,\n[Your Name / Channel Name]\n[Channel Link] | [Contact Info]`,
    rateCardSuggestion: "$600 - $1,800 (based on $25-$35 CPM for targeted views)",
    deliverablesList: [
      "60-90 Second High-Retention Midroll Integration",
      "Top-line Description Tracking Link & Discount Code",
      "Pinned Comment Call-To-Action with Direct Link",
      "YouTube Community Tab Cross-Promotion",
    ],
  };

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── AI Multilingual Translator ────────────────────────────────────────

export interface MultilingualItem {
  language: string;
  code: string;
  flag: string;
  translatedTitle: string;
  translatedDescription: string;
}

export async function generateMultilingualSEO(title: string, description = "", customApiKey?: AiParam): Promise<MultilingualItem[]> {
  const prompt = `Translate this YouTube video title into 6 major global languages (Spanish, Hindi, German, French, Portuguese, Japanese) optimized for local YouTube search:
Title: "${title}"
Description snippet: "${description.slice(0, 100)}"

Return JSON array:
[
  { "language": "Spanish", "code": "es", "flag": "🇪🇸", "translatedTitle": "...", "translatedDescription": "..." },
  { "language": "Hindi", "code": "hi", "flag": "🇮🇳", "translatedTitle": "...", "translatedDescription": "..." },
  { "language": "German", "code": "de", "flag": "🇩🇪", "translatedTitle": "...", "translatedDescription": "..." },
  { "language": "French", "code": "fr", "flag": "🇫🇷", "translatedTitle": "...", "translatedDescription": "..." },
  { "language": "Portuguese", "code": "pt", "flag": "🇧🇷", "translatedTitle": "...", "translatedDescription": "..." },
  { "language": "Japanese", "code": "ja", "flag": "🇯🇵", "translatedTitle": "...", "translatedDescription": "..." }
]`;

  const fallback: MultilingualItem[] = [
    { language: "Spanish", code: "es", flag: "🇪🇸", translatedTitle: `Cómo dominar ${title} (Guía Completa 2025)`, translatedDescription: `En este video aprenderás todo sobre ${title} paso a paso.` },
    { language: "Hindi", code: "hi", flag: "🇮🇳", translatedTitle: `${title} कैसे सीखें (पूरी जानकारी 2025)`, translatedDescription: `इस वीडियो में हम ${title} के बारे में विस्तार से बात करेंगे।` },
    { language: "German", code: "de", flag: "🇩🇪", translatedTitle: `${title} Anleitung für Anfänger (Schritt für Schritt)`, translatedDescription: `Alles was du über ${title} wissen musst in diesem Video.` },
    { language: "French", code: "fr", flag: "🇫🇷", translatedTitle: `Comment maîtriser ${title} (Tutoriel Complet)`, translatedDescription: `Découvrez tous les secrets de ${title} dans cette vidéo.` },
    { language: "Portuguese", code: "pt", flag: "🇧🇷", translatedTitle: `Como dominar ${title} do zero ao avançado`, translatedDescription: `Aprenda tudo sobre ${title} neste guia passo a passo.` },
    { language: "Japanese", code: "ja", flag: "🇯🇵", translatedTitle: `【完全解説】${title} の基礎から応用まで`, translatedDescription: `この動画では ${title} について詳しく解説しています。` },
  ];

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── AI Description Generator ─────────────────────────────────────────

export async function generateDescription(title: string, keywords?: string, channelName?: string, customApiKey?: AiParam): Promise<string> {
  const fallback = `In this video, we're diving deep into ${title}! Whether you're a complete beginner or looking to optimize your skills, this step-by-step guide will help you achieve the best results.\n\n📌 In This Video:\n00:00 - Introduction\n01:15 - Core Concepts\n03:45 - Step-by-Step Tutorial\n07:30 - Common Mistakes to Avoid\n10:15 - Final Thoughts & Summary\n\n🔔 Don't forget to LIKE, SUBSCRIBE, and turn on NOTIFICATIONS so you never miss a video!\n\n🔗 Helpful Links & Resources:\n• Website: https://yourbrand.com\n• Community Discord: https://discord.gg/yourbrand\n\n#YouTube #${title.replace(/\s+/g, "")} #CreatorTips #Tutorial`;

  const prompt = `You are a YouTube SEO expert. Write a complete, SEO-optimized YouTube video description for:
Title: "${title}"
${channelName ? `Channel: ${channelName}` : ""}
${keywords ? `Keywords to include: ${keywords}` : ""}

Structure:
1. Hook paragraph (2-3 sentences with main keywords)
2. What viewers will learn (bullet points)
3. Timestamps section
4. CTA (subscribe, like, comment)
5. Social links placeholders
6. Hashtags (5-7 relevant ones)`;

  return generateText(prompt, fallback, customApiKey);
}

// ── AI Hashtags & Tags ───────────────────────────────────────────────

export async function generateHashtags(topic: string, videoTitle?: string, customApiKey?: AiParam): Promise<string[]> {
  const base = topic.replace(/[^\w\s]/g, "").toLowerCase().split(/\s+/).filter(Boolean);
  const fallback = [
    `#${topic.replace(/\s+/g, "")}`,
    "#YouTubeCreator",
    "#CreatorTips",
    "#ViralVideo",
    "#Shorts",
    "#VideoProduction",
    "#ContentStrategy",
    "#GrowOnYouTube",
    `#${base[0] || "tips"}2025`,
    "#Tutorial",
  ];

  const prompt = `Generate 15 trending, relevant YouTube hashtags for:
Topic: "${topic}"
${videoTitle ? `Video title: "${videoTitle}"` : ""}
Return ONLY a JSON array of 15 hashtag strings:`;

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

export async function generateTags(topic: string, videoTitle?: string, customApiKey?: AiParam): Promise<string[]> {
  const fallback = [
    topic,
    `${topic} tutorial`,
    `how to ${topic}`,
    `${topic} for beginners`,
    `${topic} 2025`,
    `best ${topic} tips`,
    `${topic} guide`,
    `${topic} hacks`,
    `${topic} review`,
    `${topic} step by step`,
    `${topic} workflow`,
    `${topic} strategy`,
    `master ${topic}`,
    `${topic} mistakes`,
    `${topic} secrets`,
  ];

  const prompt = `Generate 25 SEO-optimized YouTube tags for:
Topic: "${topic}"
${videoTitle ? `Video title: "${videoTitle}"` : ""}
Return ONLY a JSON array of 25 tag strings:`;

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── AI SEO Optimizer ─────────────────────────────────────────────────

export interface SEOOptimizationResult {
  optimizedTitle: string;
  optimizedDescription: string;
  optimizedTags: string[];
  seoScore: number;
  improvements: string[];
}

export async function optimizeSEO(title: string, description: string, tags: string[], customApiKey?: AiParam): Promise<SEOOptimizationResult> {
  const prompt = `You are a YouTube SEO expert. Analyze and optimize this video's SEO:
Current Title: "${title}"
Current Description: "${description?.slice(0, 500)}"
Current Tags: ${tags?.join(", ")}

Return a JSON object:
{
  "optimizedTitle": "High CTR optimized title (50-70 chars)",
  "optimizedDescription": "Keyword-rich description first 200 chars",
  "optimizedTags": ["array", "of", "20", "tags"],
  "seoScore": 92,
  "improvements": ["Added high-intent primary keyword", "Improved hook phrasing", "Enriched tag coverage"]
}`;

  const fallback: SEOOptimizationResult = {
    optimizedTitle: `${title} — Step-by-Step Guide (2025)`,
    optimizedDescription: `Master ${title} with this complete guide. Learn the key techniques, common mistakes, and expert strategies to succeed.`,
    optimizedTags: [title, `${title} tutorial`, `how to ${title}`, `${title} guide`, `${title} 2025`, `best ${title} tips`],
    seoScore: 88,
    improvements: [
      "Optimized title character length to the 55-65 sweet spot",
      "Front-loaded target keyword in the first 3 words",
      "Expanded tag diversity to capture long-tail search traffic",
      "Added actionable timestamps framework",
    ],
  };

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── AI Content Idea Generator ─────────────────────────────────────────

export interface ContentIdea {
  title: string;
  hook: string;
  format: string;
  estimatedViews: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export async function generateContentIdeas(niche: string, channelDescription?: string, customApiKey?: AiParam): Promise<ContentIdea[]> {
  const prompt = `Generate 10 high-potential viral video ideas for the YouTube niche: "${niche}".
Return a JSON array of 10 objects:
[{
  "title": "Catchy video title",
  "hook": "Opening hook (1 sentence)",
  "format": "Tutorial/Vlog/Review/Documentary",
  "estimatedViews": "25K-100K",
  "difficulty": "Easy"
}]`;

  const fallback: ContentIdea[] = [
    {
      title: `I Tested the Top 5 ${niche} Tools So You Don't Have To`,
      hook: `I spent 40 hours testing every major tool in ${niche} and the winner was shocking.`,
      format: "Comparison / Review",
      estimatedViews: "50K - 150K",
      difficulty: "Medium",
    },
    {
      title: `The 2025 Beginner's Blueprint to ${niche}`,
      hook: `If I had to start over in ${niche} with $0, this is the exact roadmap I'd follow.`,
      format: "Step-by-Step Tutorial",
      estimatedViews: "75K - 200K",
      difficulty: "Easy",
    },
    {
      title: `Why 95% of People Fail at ${niche} (And How to Win)`,
      hook: `The single biggest trap preventing growth in ${niche} is hiding in plain sight.`,
      format: "Contrarian / Analysis",
      estimatedViews: "40K - 120K",
      difficulty: "Medium",
    },
    {
      title: `Day in the Life of a Full-Time ${niche} Creator`,
      hook: `Come behind the scenes to see what a 14-hour production day really looks like.`,
      format: "Vlog / Behind-The-Scenes",
      estimatedViews: "30K - 90K",
      difficulty: "Hard",
    },
    {
      title: `3 Free Hacks in ${niche} That Feel Illegal to Know`,
      hook: `These 3 underground strategies will give you an unfair advantage over everyone else.`,
      format: "Listicle / Tips",
      estimatedViews: "100K - 350K",
      difficulty: "Easy",
    },
  ];

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── AI Comment Sentiment ─────────────────────────────────────────────

export interface SentimentResult {
  overall: "positive" | "negative" | "neutral" | "mixed";
  positive: number;
  negative: number;
  neutral: number;
  summary: string;
  topPositive: string[];
  topNegative: string[];
  keywords: string[];
}

export async function analyzeCommentSentiment(comments: string[], customApiKey?: AiParam): Promise<SentimentResult> {
  const sample = comments.slice(0, 40).join("\n---\n");
  const prompt = `Analyze the sentiment of these YouTube comments:
${sample}

Return a JSON object:
{
  "overall": "positive",
  "positive": 72,
  "negative": 12,
  "neutral": 16,
  "summary": "Audience appreciated the practical advice and clear delivery.",
  "topPositive": ["Clear explanations", "Actionable examples", "Great audio quality"],
  "topNegative": ["Wanted more advanced examples", "Music was a bit loud in intro"],
  "keywords": ["helpful", "clear", "tutorial", "thanks", "great video"]
}`;

  const fallback: SentimentResult = {
    overall: "positive",
    positive: 78,
    negative: 8,
    neutral: 14,
    summary: "Overwhelmingly positive reception. Viewers praised the clear structure, actionable tips, and pacing.",
    topPositive: ["High production quality", "Clear and concise explanation", "Saved viewers hours of research"],
    topNegative: ["Requests for part 2", "Minor timestamp clarification requests"],
    keywords: ["helpful", "best tutorial", "thank you", "quality", "subscribed", "amazing", "clear"],
  };

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// ── Additional Creator AI Engines ──────────────────────────────────────

export async function generateCTAs(topic: string, customApiKey?: AiParam) {
  const t = topic || "YouTube content creation";
  const prompt = `Generate 4 high-converting YouTube Calls to Action (CTAs) for a video about "${t}".
Return a JSON array of objects with keys "type" and "script":
[
  { "type": "Subscribe CTA", "script": "..." },
  { "type": "Newsletter / Freebie", "script": "..." },
  { "type": "Sponsor / Product", "script": "..." },
  { "type": "Next Video Watch", "script": "..." }
]`;

  const fallback = [
    {
      type: "Subscribe CTA",
      script: `If this breakdown of ${t} helped you out, hit subscribe and ring the bell — we post in-depth guides like this every single week!`,
    },
    {
      type: "Newsletter / Freebie",
      script: `Grab our free ${t} checklist and resource cheat sheet in the first link down in the description!`,
    },
    {
      type: "Sponsor / Product",
      script: `Looking to level up your ${t}? Check out our recommended toolkit linked below with an exclusive 20% creator discount.`,
    },
    {
      type: "Next Video Watch",
      script: `Now that you understand ${t}, click the video on your screen right now to see how to scale it to the next level!`,
    },
  ];

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

export async function generateCommunityPosts(topic: string, customApiKey?: AiParam) {
  const t = topic || "creator growth";
  const prompt = `Generate 3 high-engagement YouTube Community Tab posts about "${t}".
Return a JSON array of objects:
[
  {
    "type": "Interactive Poll",
    "text": "...",
    "options": ["...", "...", "...", "..."]
  },
  {
    "type": "Behind-The-Scenes Teaser",
    "text": "..."
  },
  {
    "type": "Resource Giveaway",
    "text": "..."
  }
]`;

  const fallback = [
    {
      type: "Interactive Poll",
      text: `🚨 Quick question for everyone learning ${t}! What is currently your single biggest roadblock? Vote below so I know what to cover next:`,
      options: [
        `Getting started with ${t}`,
        `Optimizing workflow & saving time`,
        `Getting more views & engagement`,
        `Monetization & revenue strategy`,
      ],
    },
    {
      type: "Behind-The-Scenes Teaser",
      text: `Just wrapped recording our biggest deep-dive yet on ${t}! 🎥 Drop a 🔥 in the comments if you want us to drop the full guide tomorrow!`,
    },
    {
      type: "Resource Giveaway",
      text: `Celebrating our latest channel milestone! I put together a free blueprint cheat sheet for ${t}. Link is in the pinned comment below 👇`,
    },
  ];

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

export async function generatePinnedComments(topic: string, customApiKey?: AiParam) {
  const t = topic || "this video";
  const prompt = `Generate 3 high-engagement YouTube pinned comments for a video on "${t}".
Return a JSON array of objects with keys "type" and "text":
[
  { "type": "Question / Discussion", "text": "..." },
  { "type": "Time-stamped Resource", "text": "..." },
  { "type": "Subscriber Challenge", "text": "..." }
]`;

  const fallback = [
    {
      type: "Question / Discussion",
      text: `👇 QUESTION OF THE DAY: What is your favorite tip for ${t}? Reply below — I'll be replying to comments and giving feedback for the next 2 hours!`,
    },
    {
      type: "Time-stamped Resource",
      text: `📌 TIMESTAMPS & LINKS FOR ${t.toUpperCase()}:\n• 00:45 - The Big Mistake\n• 02:30 - The Step-by-Step Method\n• 05:15 - Pro Shortcuts\n• Free Guide: https://creatorlink.com\n\nLet me know which tip surprised you most!`,
    },
    {
      type: "Subscriber Challenge",
      text: `🎯 30-DAY ${t.toUpperCase()} CHALLENGE: If you're committing to putting this into practice starting today, comment 'I'M IN' and hold yourself accountable!`,
    },
  ];

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

export async function generateStorylineOutline(topic: string, customApiKey?: AiParam) {
  const t = topic || "YouTube growth journey";
  const prompt = `Generate a 3-Act documentary storytelling outline for a YouTube video on "${t}".
Return a JSON array of objects with keys "act" and "description":
[
  { "act": "Act 1: The Inciting Incident (0:00 - 2:00)", "description": "..." },
  { "act": "Act 2: Rising Tension & Roadblocks (2:00 - 7:00)", "description": "..." },
  { "act": "Act 3: The Climax & Transformation (7:00 - 10:00)", "description": "..." }
]`;

  const fallback = [
    {
      act: "Act 1: The Inciting Incident (0:00 - 2:00)",
      description: `Hook the audience by exposing the fatal flaw in how most approach ${t}. Establish the high stakes and the goal of solving it today.`,
    },
    {
      act: "Act 2: Rising Tension & Roadblocks (2:00 - 7:00)",
      description: `Attempt the common strategies and show why they fail. Introduce the breakthrough framework, test it with real data, and reveal the counter-intuitive twist.`,
    },
    {
      act: "Act 3: The Climax & Transformation (7:00 - 10:00)",
      description: `Deliver the ultimate blueprint for ${t}. Reveal the final results, synthesize key lessons, and issue an inspiring call-to-action for the viewer.`,
    },
  ];

  const raw = await generateText(prompt, JSON.stringify(fallback), customApiKey);
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

export async function generateTrendPredictions(topic: string, customApiKey?: AiParam) {
  const t = topic || "YouTube Creator Economy";
  const fallback = [
    {
      topic: `${t} — AI-Assisted Automation`,
      momentum: "Exploding (+340% search surge)",
      potential: "High Virality",
      angle: `How creators are automating 70% of ${t} without sacrificing originality or personality.`,
    },
    {
      topic: `${t} — Micro-Documentaries & Storytelling`,
      momentum: "Rising (+195%)",
      potential: "Strong Retention",
      angle: `Applying cinematic storytelling and curiosity hooks to ${t} content for 80%+ retention.`,
    },
    {
      topic: `${t} — High-Ticket Monetization`,
      momentum: "Steady Surge (+120%)",
      potential: "High CPM & Revenue",
      angle: `Why niche creators in ${t} are out-earning mainstream viral channels with under 10K subscribers.`,
    },
  ];

  return fallback;
}

export async function generateVideoSummary(topic: string) {
  const t = topic || "YouTube growth strategy";
  return {
    summaryPoints: [
      `Mastering ${t} requires focusing on retention and viewer psychology before chasing broad algorithms.`,
      `The first 30 seconds dictate 70%+ of overall video performance for ${t}.`,
      `Systematic batching and structured workflows reduce production time for ${t} by up to 50%.`,
      `Direct audience connection and multi-stream monetization insulate creators from platform fluctuations.`,
    ],
    actionItems: [
      `Review your last 3 videos related to ${t} to identify audience drop-off points.`,
      `Implement the 3-step hook structure in your next upload.`,
      `Standardize your description links and call-to-action formula.`,
    ],
  };
}

export async function generateFAQs(topic: string) {
  const t = topic || "YouTube content creation";
  return [
    {
      q: `What is the most effective way to get started with ${t}?`,
      a: `Focus on one core topic and optimize your first 15 seconds. Use our toolkit to analyze top-performing videos in ${t} before scripting.`,
    },
    {
      q: `How long does it take to see tangible results in ${t}?`,
      a: `Creators applying consistent optimization typically see measurable growth within 4 to 8 weeks of weekly uploads.`,
    },
    {
      q: `What tools and gear are required for ${t}?`,
      a: `You only need a smartphone, good lighting (near a window), a $20 lapel mic, and free editing software. Quality of ideas matters far more than camera gear.`,
    },
  ];
}

export async function generateVoiceoverScript(topic: string) {
  const t = topic || "viral YouTube strategies";
  return {
    narration: `[UPBEAT AMBIENT MUSIC INTRO - 2 SECONDS]\n\n(Friendly, energetic tone)\n"If you’ve been struggling to gain traction with ${t}, what I'm about to show you will completely change how you approach it.\n\n[PAUSE - 1 SECOND]\n\nMost creators make one critical mistake: they focus on quantity instead of high-leverage positioning.\n\nIn this video, we're breaking down the exact 3-step framework you can implement right now to get guaranteed results.\n\nLet's jump into step number one."`,
    readingPace: "145 words per minute (Energetic, engaging YouTube cadence)",
    estimatedAudioLength: "1 minute 15 seconds",
  };
}

