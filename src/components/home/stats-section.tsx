"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { value: 60, suffix: "+", label: "Creator Utilities" },
  { value: 500, suffix: "K+", label: "Videos Analyzed" },
  { value: 0, suffix: " Cost", label: "Open Access Forever" },
  { value: 99, suffix: "%", label: "Uptime & Reliability" },
];

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const displayCount = inView ? end : (end > 0 ? Math.floor(end * 0.7) : 0);

  return (
    <span ref={ref} className="tabular-nums font-mono">
      {displayCount}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-10 border-b border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border/40">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="text-center pt-4 sm:pt-0 sm:px-4"
            >
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-0.5">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
