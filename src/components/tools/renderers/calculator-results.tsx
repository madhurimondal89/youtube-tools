"use client";

import { DollarSign, TrendingUp, Percent, Award, ShoppingBag, ShieldAlert, Users, Sparkles } from "lucide-react";

export function renderCalculatorResults(toolId: string, data: Record<string, unknown>) {
  switch (toolId) {
    case "shorts-revenue-calculator": {
      const views = Number(data.views ?? 1000000);
      const rpm = String(data.shortsRPM ?? "$0.05");
      const earnings = String(data.estimatedEarnings ?? "$50.00");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              YouTube Shorts Ad Revenue Estimate
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Based on YouTube Shorts Revenue Sharing pool.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-foreground">{views.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Shorts Views</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-primary">{rpm}</div>
              <div className="text-xs text-muted-foreground mt-1">Shorts RPM (per 1K views)</div>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-2xl font-black text-emerald-500">{earnings}</div>
              <div className="text-xs text-muted-foreground mt-1">Estimated AdSense Payout</div>
            </div>
          </div>
        </div>
      );
    }

    case "cpm-calculator": {
      const result = String(data.result ?? "$0.00");
      const spend = Number(data.spend ?? 0);
      const impressions = Number(data.impressions ?? 0);
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              Ad CPM (Cost Per Mille) Calculation
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Cost per 1,000 ad impressions.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-foreground">${spend.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Ad Spend</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-foreground">{impressions.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Impressions</div>
            </div>
            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
              <div className="text-2xl font-black text-blue-500">{result}</div>
              <div className="text-xs text-muted-foreground mt-1">Calculated CPM</div>
            </div>
          </div>
        </div>
      );
    }

    case "rpm-calculator": {
      const result = String(data.result ?? "$0.00");
      const revenue = Number(data.revenue ?? 0);
      const views = Number(data.views ?? 0);
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Creator RPM (Revenue Per Mille) Calculation
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Actual creator take-home pay per 1,000 video views.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-foreground">${revenue.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Net Earnings</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-foreground">{views.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Views</div>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-2xl font-black text-emerald-500">{result}</div>
              <div className="text-xs text-muted-foreground mt-1">Calculated Creator RPM</div>
            </div>
          </div>
        </div>
      );
    }

    case "sub-goal-calculator": {
      const current = Number(data.currentSubs ?? 0);
      const remaining = Number(data.remainingSubs ?? 0);
      const percent = String(data.progressPercent ?? "0%");
      const dailyReq = String(data.requiredDailySubs ?? "0");
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg">1,000 Subscribers Monetization Goal</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Progress toward YouTube Partner Program qualification.</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>{current.toLocaleString()} Subs</span>
              <span className="text-primary">{percent} (Target: 1,000)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
              <div style={{ width: percent }} className="bg-primary h-full rounded-full" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-center pt-2">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-foreground">{remaining.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Subscribers Left</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-emerald-500">{dailyReq} subs/day</div>
              <div className="text-xs text-muted-foreground mt-0.5">Required for 60-Day Goal</div>
            </div>
          </div>
        </div>
      );
    }

    case "super-chat-revenue": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-500" />
              Live Super Chat & Stickers Payout Breakdown
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Official YouTube 70% creator / 30% platform split.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-foreground">{String(data.gross ?? "$0")}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Super Chats Sent</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-rose-500">{String(data.youtubeCut ?? "$0")}</div>
              <div className="text-xs text-muted-foreground mt-1">YouTube Platform Share (30%)</div>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-2xl font-black text-emerald-500">{String(data.creatorNet ?? "$0")}</div>
              <div className="text-xs text-muted-foreground mt-1">Creator Take-Home (70%)</div>
            </div>
          </div>
        </div>
      );
    }

    case "affiliate-revenue-calculator": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-500" />
              Description Affiliate Link Revenue Potential
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Estimated based on 2% link CTR and 5% sales conversion rate.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-foreground">{Number(data.estimatedClicks ?? 0).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Estimated Outbound Clicks</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-foreground">{Number(data.estimatedSales ?? 0).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Estimated Sales Orders</div>
            </div>
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 col-span-2 sm:col-span-1">
              <div className="text-xl font-black text-emerald-500">{String(data.estimatedRevenue ?? "$0")}</div>
              <div className="text-xs text-muted-foreground mt-1">Affiliate Commissions Earned</div>
            </div>
          </div>
        </div>
      );
    }

    case "creator-tax-estimator": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Creator Self-Employment Tax Estimator
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Estimates tax set-aside after business deductions.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-foreground">{String(data.grossIncome ?? "$0")}</div>
              <div className="text-xs text-muted-foreground mt-1">Gross Annual Income</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-bold text-blue-500">{String(data.deductibleExpenses ?? "$0")}</div>
              <div className="text-xs text-muted-foreground mt-1">Gear & Software Writeoffs (25%)</div>
            </div>
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5">
              <div className="text-2xl font-black text-rose-500">{String(data.estimatedTaxOwed ?? "$0")}</div>
              <div className="text-xs text-muted-foreground mt-1">Estimated Tax to Reserve</div>
            </div>
          </div>
        </div>
      );
    }

    case "video-roi-calculator": {
      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-border/60">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Video Production Return on Investment (ROI)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Calculates profitability after production & editing expenses.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-foreground">{String(data.productionCost ?? "$0")}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Production Cost</div>
            </div>
            <div className="p-3.5 rounded-xl border border-border bg-muted/20">
              <div className="text-xl font-bold text-foreground">{String(data.lifetimeRevenue ?? "$0")}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Expected Revenue</div>
            </div>
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-xl font-black text-emerald-500">{String(data.netProfit ?? "$0")}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Net Profit</div>
            </div>
            <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5">
              <div className="text-xl font-black text-primary">{String(data.roi ?? "0%")}</div>
              <div className="text-[10px] text-muted-foreground mt-1">Net ROI Percentage</div>
            </div>
          </div>
        </div>
      );
    }

    case "course-sales-estimator": {
      const subscribers = Number(data.subscribers ?? 10000);
      const channelTitle = (data.channelTitle as string) || null;
      const productPrice = String(data.productPrice ?? "$97");
      const conversionRate = String(data.conversionRate ?? "1.0%");
      const estimatedBuyers = Number(data.estimatedBuyers ?? 0);
      const totalRevenue = String(data.totalRevenue ?? "$0");

      interface ProjectionTier {
        rate: string;
        buyers: number;
        revenue: string;
      }
      const projections = data.projections as Record<string, ProjectionTier> | undefined;

      return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border/60">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-500" />
                Digital Product & Course Revenue Projection
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {channelTitle ? (
                  <span>Estimated for channel <strong className="text-foreground">{channelTitle}</strong> ({subscribers.toLocaleString()} subscribers)</span>
                ) : (
                  <span>Based on {subscribers.toLocaleString()} subscribers and {conversionRate} conversion rate</span>
                )}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold w-fit">
              <Users className="w-3.5 h-3.5" /> {subscribers.toLocaleString()} Audience
            </div>
          </div>

          {/* Primary High-Impact Metrics */}
          <div className="grid sm:grid-cols-3 gap-3.5 text-center">
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-black text-foreground">{productPrice}</div>
              <div className="text-xs text-muted-foreground mt-1">Course / Product Price</div>
            </div>
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="text-2xl font-black text-foreground">{estimatedBuyers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Estimated Buyers ({conversionRate})</div>
            </div>
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/15">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{totalRevenue}</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium mt-1">Projected Total Revenue</div>
            </div>
          </div>

          {/* Realistic Launch Scenario Breakdown */}
          {projections && (
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-primary" /> Launch Scenarios & Benchmarks
              </h4>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-border/80 bg-background space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground">Conservative (0.5%)</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{projections.conservative.buyers} sales</span>
                  </div>
                  <div className="text-lg font-bold text-foreground">{projections.conservative.revenue}</div>
                  <p className="text-[11px] text-muted-foreground">Cold traffic or community tab post only</p>
                </div>

                <div className="p-3.5 rounded-xl border border-primary/40 bg-primary/5 space-y-1 relative">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-primary">Realistic (1.0%)</span>
                    <span className="font-mono text-[11px] text-primary font-semibold">{projections.realistic.buyers} sales</span>
                  </div>
                  <div className="text-lg font-black text-primary">{projections.realistic.revenue}</div>
                  <p className="text-[11px] text-muted-foreground">Dedicated video launch + pinned comment</p>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Optimistic (2.5%)</span>
                    <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">{projections.optimistic.buyers} sales</span>
                  </div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{projections.optimistic.revenue}</div>
                  <p className="text-[11px] text-muted-foreground">Warm email list & limited-time discount</p>
                </div>
              </div>
            </div>
          )}

          {/* Actionable Creator Tip */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-foreground font-semibold">Creator Pro-Tip:</strong> Digital products (courses, presets, templates) typically boast a 90%+ profit margin. Capturing your viewers&apos; email addresses before launch can increase conversion rates from 0.5% up to 3-5%.
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
