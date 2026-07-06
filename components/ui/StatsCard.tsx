"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

export function StatsCard({
  label,
  value,
  suffix = "",
  prefix = "",
  icon,
  className,
  delay = 0,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const duration = 1500;
      const steps = 60;
      const stepTime = duration / steps;
      const increment = value / steps;
      let current = 0;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        current = Math.min(current + increment, value);
        // Ease-out effect
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * eased));

        if (step >= steps) {
          setDisplayValue(value);
          clearInterval(interval);
        }
      }, stepTime);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  const formattedValue = Number.isInteger(value)
    ? displayValue.toLocaleString()
    : displayValue.toFixed(1);

  return (
    <div
      ref={ref}
      className={cn(
        "liquid-glass rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-white/60 text-xs uppercase tracking-wider"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {label}
        </span>
        <div className="text-white/40">{icon}</div>
      </div>
      <div className="text-2xl sm:text-3xl font-normal text-white">
        {prefix}{formattedValue}{suffix}
      </div>
    </div>
  );
}
