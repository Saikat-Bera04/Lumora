"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  ArrowUpDown,
  ArrowRight,
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Grid3X3,
  List,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/PageTransition";
import type { Attraction } from "@/types";

const ITEMS_PER_PAGE = 6;

export default function PreviewPage() {
  const router = useRouter();
  const { dataset, preferences } = useStore();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "rating" | "fee" | "time">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"cards" | "table">("cards");

  useEffect(() => {
    if (!dataset) router.push("/upload");
  }, [dataset, router]);

  if (!dataset) return null;

  const categories = ["all", ...new Set(dataset.attractions.map((a) => a.category))];

  const filtered = useMemo(() => {
    let result = [...dataset.attractions];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      result = result.filter((a) => a.category === filterCategory);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "rating": cmp = a.rating - b.rating; break;
        case "fee": cmp = a.entryFee - b.entryFee; break;
        case "time": cmp = a.visitTime - b.visitTime; break;
      }
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }, [dataset.attractions, search, filterCategory, sortBy, sortOrder]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="flex items-center justify-between px-5 sm:px-8 md:px-12 py-5 sm:py-6">
          <Link href="/" className="text-white text-xl sm:text-2xl italic">
            Lumora
          </Link>
          <span className="text-white/50 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
            Step 3 of 4
          </span>
        </nav>

        <div className="flex-1 px-5 sm:px-8 md:px-12 pb-20">
          <PageTransition>
            <FadeIn className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-white leading-[1.1] mb-4">
                Dataset Preview
              </h1>
              <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto"
                style={{ fontFamily: "system-ui, sans-serif" }}>
                Review your attractions before optimization.
                {" "}{dataset.attractions.length} attractions • {dataset.routes.length} routes
              </p>
            </FadeIn>

            {/* Controls */}
            <FadeIn delay={0.1} className="max-w-6xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* Search */}
                <div className="liquid-glass rounded-xl flex items-center gap-2 px-4 py-2.5 flex-1">
                  <Search size={16} className="text-white/40" />
                  <input
                    type="text"
                    placeholder="Search attractions..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="bg-transparent text-white text-sm outline-none flex-1 placeholder:text-white/30"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  />
                </div>

                {/* Category filter */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setFilterCategory(cat); setPage(1); }}
                      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-300 ${
                        filterCategory === cat
                          ? "bg-white text-black"
                          : "liquid-glass text-white/60 hover:text-white"
                      }`}
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      {cat === "all" ? "All" : cat}
                    </button>
                  ))}
                </div>

                {/* View toggle */}
                <div className="flex gap-1 liquid-glass rounded-xl p-1">
                  <button
                    onClick={() => setView("cards")}
                    className={`p-2 rounded-lg transition-all ${view === "cards" ? "bg-white/10" : ""}`}
                  >
                    <Grid3X3 size={16} className={view === "cards" ? "text-white" : "text-white/40"} />
                  </button>
                  <button
                    onClick={() => setView("table")}
                    className={`p-2 rounded-lg transition-all ${view === "table" ? "bg-white/10" : ""}`}
                  >
                    <List size={16} className={view === "table" ? "text-white" : "text-white/40"} />
                  </button>
                </div>
              </div>
            </FadeIn>

            {/* Sort buttons */}
            <FadeIn delay={0.15} className="max-w-6xl mx-auto mb-6">
              <div className="flex gap-2 flex-wrap">
                {([
                  ["name", "Name"],
                  ["rating", "Rating"],
                  ["fee", "Entry Fee"],
                  ["time", "Visit Time"],
                ] as const).map(([field, label]) => (
                  <button
                    key={field}
                    onClick={() => toggleSort(field)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      sortBy === field
                        ? "bg-white/10 text-white"
                        : "text-white/40 hover:text-white/60"
                    }`}
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    {label}
                    <ArrowUpDown size={12} />
                  </button>
                ))}
              </div>
            </FadeIn>

            {/* Content */}
            <div className="max-w-6xl mx-auto">
              {view === "cards" ? (
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginated.map((attraction) => (
                    <StaggerItem key={attraction.id}>
                      <div className="liquid-glass rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-white text-lg leading-tight">
                              {attraction.name}
                            </h3>
                            <span className="text-white/40 text-xs mt-1 inline-block"
                              style={{ fontFamily: "system-ui, sans-serif" }}>
                              {attraction.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                              {attraction.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Wallet size={13} />
                            <span className="text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>
                              ₹{attraction.entryFee}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Clock size={13} />
                            <span className="text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>
                              {attraction.visitTime}h
                            </span>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <FadeIn delay={0.2}>
                  <div className="liquid-glass rounded-2xl overflow-hidden">
                    <table className="w-full" style={{ fontFamily: "system-ui, sans-serif" }}>
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left text-white/50 text-xs uppercase tracking-wider px-5 py-3">Name</th>
                          <th className="text-left text-white/50 text-xs uppercase tracking-wider px-5 py-3">Category</th>
                          <th className="text-right text-white/50 text-xs uppercase tracking-wider px-5 py-3">Fee</th>
                          <th className="text-right text-white/50 text-xs uppercase tracking-wider px-5 py-3">Time</th>
                          <th className="text-right text-white/50 text-xs uppercase tracking-wider px-5 py-3">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((a) => (
                          <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="text-white text-sm px-5 py-3">{a.name}</td>
                            <td className="text-white/60 text-sm px-5 py-3">{a.category}</td>
                            <td className="text-white/60 text-sm text-right px-5 py-3">₹{a.entryFee}</td>
                            <td className="text-white/60 text-sm text-right px-5 py-3">{a.visitTime}h</td>
                            <td className="text-right px-5 py-3">
                              <span className="flex items-center justify-end gap-1 text-amber-400 text-sm">
                                <Star size={12} fill="currentColor" /> {a.rating}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </FadeIn>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg liquid-glass text-white/60 hover:text-white disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-xs transition-all ${
                        page === i + 1
                          ? "bg-white text-black"
                          : "liquid-glass text-white/50 hover:text-white"
                      }`}
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg liquid-glass text-white/60 hover:text-white disabled:opacity-30 transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {/* Navigation */}
              <FadeIn delay={0.3} className="mt-10 flex items-center justify-between">
                <button
                  onClick={() => router.push("/preferences")}
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={() => router.push("/processing")}
                  className="group bg-white text-black font-medium px-8 py-3 rounded-full flex items-center gap-3 transition-all duration-300 hover:gap-4 hover:shadow-lg hover:shadow-white/10"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  <Sparkles size={18} />
                  Optimize Itinerary
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </FadeIn>
            </div>
          </PageTransition>
        </div>
      </div>
    </section>
  );
}
