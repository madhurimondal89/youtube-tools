import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — YouTube Creator Toolkit Pro",
  description: "Terms and conditions governing the use of YouTube Creator Toolkit Pro web utilities.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const lastUpdated = "July 2025";

  return (
    <div className="min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using YouTube Creator Toolkit Pro, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">2. Permitted Use &amp; Intellectual Property</h2>
            <p>
              YouTube Creator Toolkit Pro provides online utilities intended for personal, editorial, research, and channel optimization purposes. Users agree not to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Use the services to infringe upon copyright, intellectual property, or third-party digital ownership.</li>
              <li>Attempt to reverse-engineer, exploit, or cause automated denial-of-service disruptions against our infrastructure.</li>
              <li>Re-distribute or sell media downloaded without appropriate rights, licenses, or creator permissions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">3. Disclaimer of Warranties</h2>
            <p>
              The tools and data provided on YouTube Creator Toolkit Pro are provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties, expressed or implied, regarding the accuracy, likely results, or reliability of algorithm predictions, SEO scoring, or estimated revenue calculations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">4. Third-Party Trademarks</h2>
            <p>
              YouTube™ is a registered trademark of Google LLC. YouTube Creator Toolkit Pro is an independent developer utility and is not affiliated, endorsed, or sponsored by YouTube, Google LLC, or Alphabet Inc.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">5. Modifications to Service</h2>
            <p>
              We reserve the right to modify or discontinue, temporarily or permanently, any portion of our tools or services with or without notice at any time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

