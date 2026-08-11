"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className, hover = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "liquid-glass rounded-2xl p-6 relative group overflow-hidden",
        hover && "transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/5 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
