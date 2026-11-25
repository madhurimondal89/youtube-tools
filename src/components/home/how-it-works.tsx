"use client";

import { ClipboardPaste, Wrench, Sparkles, Download } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Paste any YouTube URL",
    description:
      "Paste a video URL, channel URL, @username, playlist, or Shorts link into the search box.",
    step: "01",
  },
  {
    icon: Wrench,
    title: "Choose your tool",
    description:
      "Select from 60+ tools, video downloader, AI scriptwriter, SEO audit, calculators and more.",
    step: "02",
  },
  {
    icon: Sparkles,
    title: "Get instant results",
    description:
      "Analyze metadata, generate AI scripts, or extract media formats in seconds.",
    step: "03",
  },
  {
    icon: Download,
    title: "Download & Copy",
    description:
      "Download MP4/MP3 media, copy high-CTR tags, scripts, and chapters with one click.",
    step: "04",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-muted/15 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-foreground">
            How It <span className="accent-heading">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Use any of our 60+ YouTube creator tools in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="relative text-left p-5 rounded-xl border border-border/80 bg-card shadow-xs"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-border/80 bg-muted/50 text-foreground">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-mono text-xs font-bold text-muted-foreground/80 px-2 py-0.5 rounded bg-muted/40 border border-border/50">
                  Step {step.step}
                </span>
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
