import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — YouTube Creator Toolkit Pro",
  description: "Privacy Policy for YouTube Creator Toolkit Pro. Learn how we handle information, cookies, and API keys.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const lastUpdated = "July 2025";

  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
            <p>
              Welcome to YouTube Creator Toolkit Pro (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal information. This Privacy Policy outlines what data we collect, how it is used, and the measures we take to safeguard your privacy when using our website and tools.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">2. Information We Do NOT Collect</h2>
            <p>
              We believe in data minimization:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>We do not require user account registration, login credentials, or passwords.</li>
              <li>We do not collect credit card details or financial information.</li>
              <li>We do not store your uploaded audio or downloaded video files permanently on our servers. Downloaded assets are kept temporarily in memory or ephemeral cache only for the duration required to complete the delivery to your browser.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">3. Custom API Keys &amp; Client-Side Storage</h2>
            <p>
              If you choose to provide custom Google Gemini or YouTube Data API keys in our settings modal, these keys are stored exclusively in your personal browser&apos;s <code>localStorage</code>. They are transmitted directly from your client in secure HTTP headers for processing your specific API requests and are never harvested, logged, or retained on our databases.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">4. YouTube API Services &amp; Google Services</h2>
            <p>
              Our application interacts with public YouTube data. By using tools powered by YouTube data, you acknowledge and agree to be bound by the{" "}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                YouTube Terms of Service
              </a>{" "}
              and the{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Privacy Policy
              </a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">5. Cookies and Analytics</h2>
            <p>
              We may utilize standard, privacy-friendly analytics and basic cookies strictly necessary to remember user preferences (such as your chosen dark/light visual theme).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">6. Contact Us</h2>
            <p>
              If you have any questions or inquiries regarding this Privacy Policy, please reach out to us via our{" "}
              <a href="/contact" className="text-primary hover:underline">
                Contact Page
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

