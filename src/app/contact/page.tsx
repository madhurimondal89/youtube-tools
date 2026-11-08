import type { Metadata } from "next";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — YouTube Creator Toolkit Pro",
  description: "Get in touch with the YouTube Creator Toolkit Pro team for support, feature requests, or partnership inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Have questions, feedback, or a tool suggestion? We would love to hear from you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Direct Support &amp; Feedback</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reach out to our creator engineering team directly for support, bug reports, or feature ideas.
            </p>
            <div className="pt-2">
              <a
                href="mailto:support@youtubetoolkit.pro"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                support@youtubetoolkit.pro →
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-foreground">Common Inquiries</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Wondering how custom Gemini and YouTube Data API keys work? Check out the Settings Modal in the top navigation bar anytime.
            </p>
            <div className="pt-2 text-xs text-muted-foreground">
              Response time: Within 24-48 business hours.
            </div>
          </div>
        </div>

        {/* Feature Suggestion Card */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Have a New Tool Idea?</h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            We are actively expanding our suite of 60+ creator tools. Let us know what utilities would speed up your workflow.
          </p>
          <div className="pt-2">
            <a
              href="mailto:ideas@youtubetoolkit.pro"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Submit Feature Request
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
