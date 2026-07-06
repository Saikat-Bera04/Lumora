"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  PieChart,
  BarChart3,
  TrendingUp,
  Star,
  Map,
  FileText,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { getCategoryColor } from "@/lib/helpers";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";

// Dynamic import for Recharts (no SSR)
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const PieChartComponent = dynamic(
  () => import("recharts").then((m) => m.PieChart),
  { ssr: false }
);
const Pie = dynamic(
  () => import("recharts").then((m) => m.Pie),
  { ssr: false }
);
const Cell = dynamic(
  () => import("recharts").then((m) => m.Cell),
  { ssr: false }
);
const BarChartComponent = dynamic(
  () => import("recharts").then((m) => m.BarChart),
  { ssr: false }
);
const Bar = dynamic(
  () => import("recharts").then((m) => m.Bar),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((m) => m.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((m) => m.YAxis),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false }
);
const RadarChart = dynamic(
  () => import("recharts").then((m) => m.RadarChart),
  { ssr: false }
);
const PolarGrid = dynamic(
  () => import("recharts").then((m) => m.PolarGrid),
  { ssr: false }
);
const PolarAngleAxis = dynamic(
  () => import("recharts").then((m) => m.PolarAngleAxis),
  { ssr: false }
);
const Radar = dynamic(
  () => import("recharts").then((m) => m.Radar),
  { ssr: false }
);

const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#6366F1"];

export default function AnalyticsPage() {
  const router = useRouter();
  const { optimizationResult } = useStore();

  useEffect(() => {
    if (!optimizationResult) router.push("/upload");
  }, [optimizationResult, router]);

  const charts = useMemo(() => {
    if (!optimizationResult) return null;
    const r = optimizationResult;

    // Budget Distribution
    const budgetData = [
      { name: "Entry Fees", value: r.totalEntryFees },
      { name: "Travel Cost", value: r.totalTravelCost },
      { name: "Remaining", value: Math.max(0, r.budgetRemaining) },
    ];

    // Time Distribution
    const timeData = r.itinerary.map((s) => ({
      name: s.attraction.name.length > 12
        ? s.attraction.name.slice(0, 12) + "…"
        : s.attraction.name,
      visit: s.attraction.visitTime,
      travel: s.travelTimeFromPrev,
    }));

    // Category Distribution
    const categoryCounts: Record<string, number> = {};
    r.itinerary.forEach((s) => {
      const cat = s.attraction.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value,
      color: getCategoryColor(name),
    }));

    // Distance by stop
    const distanceData = r.itinerary.map((s) => ({
      name: s.attraction.name.length > 12
        ? s.attraction.name.slice(0, 12) + "…"
        : s.attraction.name,
      distance: s.travelDistanceFromPrev,
      cumulative: s.cumulativeDistance,
    }));

    // Ratings
    const ratingData = r.itinerary.map((s) => ({
      name: s.attraction.name.length > 10
        ? s.attraction.name.slice(0, 10) + "…"
        : s.attraction.name,
      rating: s.attraction.rating,
      fullMark: 5,
    }));

    return { budgetData, timeData, categoryData, distanceData, ratingData };
  }, [optimizationResult]);

  if (!optimizationResult || !charts) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="liquid-glass rounded-xl px-4 py-3"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}>
          <p className="text-white text-xs mb-1" style={{ fontFamily: "system-ui, sans-serif" }}>{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-white/70 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>
              {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="flex items-center justify-between px-5 sm:px-8 md:px-12 py-5 sm:py-6">
          <Link href="/" className="text-white text-xl sm:text-2xl italic">
            Lumora
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="liquid-glass rounded-full px-4 py-2 text-white/70 text-xs flex items-center gap-2 hover:text-white transition-all"
              style={{ fontFamily: "system-ui, sans-serif" }}>
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <Link href="/map" className="liquid-glass rounded-full px-4 py-2 text-white/70 text-xs flex items-center gap-2 hover:text-white transition-all"
              style={{ fontFamily: "system-ui, sans-serif" }}>
              <Map size={14} /> <span className="hidden sm:inline">Map</span>
            </Link>
            <Link href="/summary" className="liquid-glass rounded-full px-4 py-2 text-white/70 text-xs flex items-center gap-2 hover:text-white transition-all"
              style={{ fontFamily: "system-ui, sans-serif" }}>
              <FileText size={14} /> <span className="hidden sm:inline">Summary</span>
            </Link>
          </div>
        </nav>

        <div className="flex-1 px-5 sm:px-8 md:px-12 pb-20">
          <PageTransition>
            <FadeIn className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-white leading-[1.1] mb-4">
                Trip Analytics
              </h1>
              <p className="text-white/60 text-sm max-w-md mx-auto"
                style={{ fontFamily: "system-ui, sans-serif" }}>
                Visual breakdown of your optimized itinerary.
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
              {/* Budget Distribution - Pie */}
              <FadeIn delay={0.1}>
                <div className="liquid-glass rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PieChart size={16} className="text-white/50" />
                    <h3 className="text-white/60 text-xs uppercase tracking-wider"
                      style={{ fontFamily: "system-ui, sans-serif" }}>Budget Distribution</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChartComponent>
                        <Pie
                          data={charts.budgetData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {charts.budgetData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i]} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChartComponent>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-2">
                    {charts.budgetData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                        <span className="text-white/40 text-[10px]" style={{ fontFamily: "system-ui, sans-serif" }}>
                          {d.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Travel Time - Bar */}
              <FadeIn delay={0.15}>
                <div className="liquid-glass rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={16} className="text-white/50" />
                    <h3 className="text-white/60 text-xs uppercase tracking-wider"
                      style={{ fontFamily: "system-ui, sans-serif" }}>Time Breakdown</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChartComponent data={charts.timeData}>
                        <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="visit" stackId="a" fill="#8B5CF6" radius={[0, 0, 0, 0]} name="Visit" />
                        <Bar dataKey="travel" stackId="a" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Travel" />
                      </BarChartComponent>
                    </ResponsiveContainer>
                  </div>
                </div>
              </FadeIn>

              {/* Category Distribution - Pie */}
              <FadeIn delay={0.2}>
                <div className="liquid-glass rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PieChart size={16} className="text-white/50" />
                    <h3 className="text-white/60 text-xs uppercase tracking-wider"
                      style={{ fontFamily: "system-ui, sans-serif" }}>Category Split</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChartComponent>
                        <Pie
                          data={charts.categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {charts.categoryData.map((d, i) => (
                            <Cell key={i} fill={d.color} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChartComponent>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-3 flex-wrap mt-2">
                    {charts.categoryData.map((d) => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-white/40 text-[10px]" style={{ fontFamily: "system-ui, sans-serif" }}>
                          {d.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Distance Analysis - Bar */}
              <FadeIn delay={0.25}>
                <div className="liquid-glass rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-white/50" />
                    <h3 className="text-white/60 text-xs uppercase tracking-wider"
                      style={{ fontFamily: "system-ui, sans-serif" }}>Distance per Leg</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChartComponent data={charts.distanceData}>
                        <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="distance" fill="#10B981" radius={[4, 4, 0, 0]} name="Distance (km)" />
                      </BarChartComponent>
                    </ResponsiveContainer>
                  </div>
                </div>
              </FadeIn>

              {/* Ratings - Radar */}
              <FadeIn delay={0.3} className="md:col-span-2 lg:col-span-2">
                <div className="liquid-glass rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={16} className="text-white/50" />
                    <h3 className="text-white/60 text-xs uppercase tracking-wider"
                      style={{ fontFamily: "system-ui, sans-serif" }}>Attraction Ratings</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={charts.ratingData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                        <Radar name="Rating" dataKey="rating" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </FadeIn>
            </div>
          </PageTransition>
        </div>
      </div>
    </section>
  );
}
