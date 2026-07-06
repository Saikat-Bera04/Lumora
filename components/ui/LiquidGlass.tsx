"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "nav" | "button" | "span";
}

export function LiquidGlass({ children, className, as: Tag = "div" }: LiquidGlassProps) {
  return (
    <Tag className={cn("liquid-glass", className)}>
      {children}
    </Tag>
  );
}
