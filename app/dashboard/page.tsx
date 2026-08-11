"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  Route,
  Wallet,
  Ticket,
  Clock,
  Star,
  PiggyBank,
  ArrowDown,
  Map,
  BarChart3,
  FileText,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Navbar } from "@/components/ui/Navbar";
import { StatsCard } from "@/components/ui/StatsCard";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";
import { formatCurrency, formatDistance, formatTime } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { optimizationResult, dataset } = useStore();

  useEffect(() => {
    if (!optimizationResult) router.push("/upload");
  }, [optimizationResult, router]);

  if (!optimizationResult) return null;

  const r = optimizationResult;

  const navItems = [
    { label: "Map", href: "/map", icon: Map },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Summary", href: "/summary", icon: FileText },
  ];

  return (
    <section className="relative min-h-screen bg-aurora overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 px-5 sm:px-8 md:px-12 pb-20">
          <PageTransition>
            {/* Hero Title */}
            <FadeIn className="text-center mb-10 sm:mb-14">
              <div className="liquid-glass rounded-full px-5 py-2 text-xs inline-block mb-6"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", color: "rgba(255,255,255,0.6)" }}>
                Optimization Complete • {r.attractionsVisited} attractions selected
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-white leading-[1.1] mb-4">
                Your Perfect Journey Awaits
              </h1>
              <p className="text-white/60 text-sm max-w-lg mx-auto"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                Here&apos;s your personalized itinerary optimized for time, cost, and unforgettable experiences.
              </p>
            </FadeIn>

            {/* Stats Grid */}
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-6xl mx-auto mb-12">
              <StaggerItem>
                <StatsCard label="Attractions" value={r.attractionsVisited} icon={<MapPin size={18} />} />
              </StaggerItem>
              <StaggerItem>
                <StatsCard label="Distance" value={parseFloat(r.totalDistance.toFixed(1))} suffix=" km" icon={<Route size={18} />} delay={100} />
              </StaggerItem>
              <StaggerItem>
                <StatsCard label="Travel Cost" value={r.totalTravelCost} prefix="₹" icon={<Wallet size={18} />} delay={200} />
              </StaggerItem>
              <StaggerItem>
                <StatsCard label="Entry Fees" value={r.totalEntryFees} prefix="₹" icon={<Ticket size={18} />} delay={300} />
              </StaggerItem>
              <StaggerItem>
                <StatsCard label="Budget Left" value={r.budgetRemaining} prefix="₹" icon={<PiggyBank size={18} />} delay={400} />
              </StaggerItem>
            </StaggerContainer>

            {/* Additional Stats Row */}
            <StaggerContainer staggerDelay={0.05} className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-6xl mx-auto mb-14">
              <StaggerItem>
                <StatsCard label="Total Time" value={parseFloat(r.totalTime.toFixed(1))} suffix="h" icon={<Clock size={18} />} delay={500} />
              </StaggerItem>
              <StaggerItem>
                <StatsCard label="Total Cost" value={r.totalCost} prefix="₹" icon={<TrendingUp size={18} />} delay={600} />
              </StaggerItem>
              <StaggerItem>
                <StatsCard label="Total Rating" value={r.totalRating} suffix="★" icon={<Star size={18} />} delay={700} />
              </StaggerItem>
              <StaggerItem>
                <StatsCard label="Categories" value={r.categories.length} icon={<BarChart3 size={18} />} delay={800} />
              </StaggerItem>
            </StaggerContainer>

            {/* Timeline */}
            <FadeIn delay={0.3} className="max-w-2xl mx-auto">
              <h2 className="text-2xl text-white text-center mb-8">
                Trip Timeline
              </h2>
              <div className="space-y-0">
                {r.itinerary.map((stop, i) => (
                  <div key={stop.order}>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                      className="liquid-glass rounded-2xl p-5 flex items-center gap-4"
                    >
                      {/* Order Number */}
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-sm font-medium shrink-0"
                        style={{ fontFamily: "system-ui, sans-serif" }}>
                        {stop.order}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-lg truncate">
                          {stop.attraction.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-white/40 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>
                            {stop.attraction.category}
                          </span>
                          <span className="text-white/40 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>
                            ₹{stop.attraction.entryFee}
                          </span>
                          <span className="text-white/40 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>
                            {stop.attraction.visitTime}h visit
                          </span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 text-amber-400 shrink-0">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                          {stop.attraction.rating}
                        </span>
                      </div>
                    </motion.div>

                    {/* Connector */}
                    {i < r.itinerary.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex flex-col items-center py-2"
                      >
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex items-center gap-2 my-1">
                          <ArrowDown size={12} className="text-white/20" />
                          <span className="text-white/25 text-[10px]" style={{ fontFamily: "system-ui, sans-serif" }}>
                            {r.itinerary[i + 1].travelDistanceFromPrev.toFixed(1)} km •{" "}
                            ₹{r.itinerary[i + 1].travelCostFromPrev}
                          </span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Bottom Navigation */}
            <FadeIn delay={0.5} className="mt-14 flex justify-center gap-3 flex-wrap max-w-2xl mx-auto">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group liquid-glass rounded-full px-6 py-3 text-white/70 text-sm flex items-center gap-2 transition-all duration-300 hover:text-white hover:scale-105"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  <item.icon size={16} />
                  {item.label}
                  <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
            </FadeIn>
          </PageTransition>
        </div>
      </div>
    </section>
  );
}
