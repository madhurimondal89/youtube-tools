"use client";

import { ClipboardPaste, Wrench, Sparkles, Download } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardPaste,
    title: "Paste any YouTube URL",
    description:
      "Paste a video URL, channel URL, @username, playlist, or Shorts link into the search box.",
    color: "from-red-500 to-rose-600",
    step: "01",
  },
  {
    icon: Wrench,
    title: "Choose your tool",
    description:
      "Select from 60+ tools — video downloader, AI scriptwriter, SEO audit, calculators and more.",
    color: "from-purple-500 to-indigo-600",
    step: "02",
  },
  {
    icon: Sparkles,
    title: "Get instant results",
    description:
      "Analyze metadata, generate AI scripts, or extract media formats in seconds.",
    color: "from-pink-500 to-rose-500",
    step: "03",
  },
  {
    icon: Download,
    title: "Download & Copy",
    description:
      "Download MP4/MP3 media, copy high-CTR tags, scripts, and chapters with one click.",
    color: "from-emerald-500 to-teal-500",
    step: "04",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-card/30 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Use any of our 60+ YouTube creator tools in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="relative text-center p-4 rounded-2xl border border-border/50 bg-card/40"
            >
              {/* Step number */}
              <div className="relative inline-block mb-4">
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow mx-auto`}
                >
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold">
                  {step.step}
                </div>
              </div>

              <h3 className="font-semibold text-sm mb-1.5 text-foreground">{step.title}</h3>
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
