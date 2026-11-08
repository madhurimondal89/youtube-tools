"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const STATS: StatItem[] = [
  { value: 60, suffix: "+", label: "Pro YouTube Tools", color: "from-red-500 to-rose-500" },
  { value: 500, suffix: "K+", label: "Videos Analyzed", color: "from-purple-500 to-indigo-500" },
  { value: 0, suffix: " Cost", label: "100% Free Forever", color: "from-emerald-500 to-teal-500" },
  { value: 99, suffix: "%", label: "Tool Reliability", color: "from-amber-500 to-orange-500" },
];

function CountUp({ end, suffix }: { end: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const displayCount = inView ? end : (end > 0 ? Math.floor(end * 0.7) : 0);

  return (
    <span ref={ref} className="tabular-nums">
      {displayCount}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="py-12 border-y border-border/60 bg-card/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="text-center"
            >
              <div
                className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}
              >
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-semibold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
