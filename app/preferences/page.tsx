"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet,
  Clock,
  MapPin,
  Tag,
  Car,
  Footprints,
  Bus,
  Hash,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { PageTransition, FadeIn } from "@/components/ui/PageTransition";

const TRANSPORT_MODES = [
  { value: "auto" as const, label: "Auto/Cab", icon: Car },
  { value: "public" as const, label: "Public Transit", icon: Bus },
  { value: "walking" as const, label: "Walking", icon: Footprints },
];

export default function PreferencesPage() {
  const router = useRouter();
  const { dataset, preferences, setPreferences } = useStore();

  const [budget, setBudget] = useState(preferences.budget);
  const [maxTime, setMaxTime] = useState(preferences.maxTime);
  const [startLocation, setStartLocation] = useState(preferences.startLocation);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    preferences.preferredCategories
  );
  const [transportMode, setTransportMode] = useState(preferences.transportMode);
  const [maxAttractions, setMaxAttractions] = useState(preferences.maxAttractions);

  // Redirect if no dataset
  useEffect(() => {
    if (!dataset) {
      router.push("/upload");
    }
  }, [dataset, router]);

  if (!dataset) return null;

  const categories = [...new Set(dataset.attractions.map((a) => a.category))];

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = () => {
    setPreferences({
      budget,
      maxTime,
      startLocation,
      preferredCategories: selectedCategories,
      transportMode,
      maxAttractions,
    });
    router.push("/preview");
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-white/[0.015] rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-5 sm:px-8 md:px-12 py-5 sm:py-6">
          <Link href="/" className="text-white text-xl sm:text-2xl italic">
            Lumora
          </Link>
          <span
            className="text-white/50 text-sm"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Step 2 of 4
          </span>
        </nav>

        <div className="flex-1 flex flex-col items-center px-5 sm:px-8 pb-20">
          <PageTransition>
            <div className="w-full max-w-3xl">
              <FadeIn className="text-center mb-10 sm:mb-14">
                <h1 className="text-3xl sm:text-4xl md:text-5xl text-white leading-[1.1] mb-4">
                  Set Your Preferences
                </h1>
                <p
                  className="text-white/60 text-sm sm:text-base max-w-md mx-auto"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Tell us about your ideal trip and we&apos;ll optimize the
                  perfect itinerary.
                </p>
              </FadeIn>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Budget */}
                <FadeIn delay={0.1}>
                  <div className="liquid-glass rounded-2xl p-6">
                    <label className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider mb-4"
                      style={{ fontFamily: "system-ui, sans-serif" }}>
                      <Wallet size={14} /> Budget (₹)
                    </label>
                    <input
                      type="range"
                      min={200}
                      max={5000}
                      step={50}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full accent-white h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-3">
                      <span className="text-white/40 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>₹200</span>
                      <span className="text-white text-2xl">₹{budget.toLocaleString()}</span>
                      <span className="text-white/40 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>₹5,000</span>
                    </div>
                  </div>
                </FadeIn>

                {/* Max Time */}
                <FadeIn delay={0.15}>
                  <div className="liquid-glass rounded-2xl p-6">
                    <label className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider mb-4"
                      style={{ fontFamily: "system-ui, sans-serif" }}>
                      <Clock size={14} /> Maximum Time (hours)
                    </label>
                    <input
                      type="range"
                      min={2}
                      max={16}
                      step={0.5}
                      value={maxTime}
                      onChange={(e) => setMaxTime(Number(e.target.value))}
                      className="w-full accent-white h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-3">
                      <span className="text-white/40 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>2h</span>
                      <span className="text-white text-2xl">{maxTime}h</span>
                      <span className="text-white/40 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>16h</span>
                    </div>
                  </div>
                </FadeIn>

                {/* Starting Location */}
                <FadeIn delay={0.2}>
                  <div className="liquid-glass rounded-2xl p-6">
                    <label className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider mb-4"
                      style={{ fontFamily: "system-ui, sans-serif" }}>
                      <MapPin size={14} /> Starting Location
                    </label>
                    <select
                      value={startLocation}
                      onChange={(e) => setStartLocation(Number(e.target.value))}
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer"
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      {dataset.attractions.map((a) => (
                        <option key={a.id} value={a.id} className="bg-black text-white">
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </FadeIn>

                {/* Max Attractions */}
                <FadeIn delay={0.25}>
                  <div className="liquid-glass rounded-2xl p-6">
                    <label className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider mb-4"
                      style={{ fontFamily: "system-ui, sans-serif" }}>
                      <Hash size={14} /> Max Attractions
                    </label>
                    <input
                      type="range"
                      min={2}
                      max={Math.min(dataset.attractions.length, 10)}
                      step={1}
                      value={maxAttractions}
                      onChange={(e) => setMaxAttractions(Number(e.target.value))}
                      className="w-full accent-white h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-3">
                      <span className="text-white/40 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>2</span>
                      <span className="text-white text-2xl">{maxAttractions}</span>
                      <span className="text-white/40 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>
                        {Math.min(dataset.attractions.length, 10)}
                      </span>
                    </div>
                  </div>
                </FadeIn>

                {/* Categories */}
                <FadeIn delay={0.3} className="md:col-span-2">
                  <div className="liquid-glass rounded-2xl p-6">
                    <label className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider mb-4"
                      style={{ fontFamily: "system-ui, sans-serif" }}>
                      <Tag size={14} /> Preferred Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <motion.button
                          key={cat}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleCategory(cat)}
                          className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                            selectedCategories.includes(cat)
                              ? "bg-white text-black"
                              : "liquid-glass text-white/70 hover:text-white"
                          }`}
                          style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                          {cat}
                        </motion.button>
                      ))}
                    </div>
                    {selectedCategories.length === 0 && (
                      <p className="text-white/30 text-xs mt-3" style={{ fontFamily: "system-ui, sans-serif" }}>
                        No filter — all categories will be considered
                      </p>
                    )}
                  </div>
                </FadeIn>

                {/* Transport Mode */}
                <FadeIn delay={0.35} className="md:col-span-2">
                  <div className="liquid-glass rounded-2xl p-6">
                    <label className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider mb-4"
                      style={{ fontFamily: "system-ui, sans-serif" }}>
                      <Car size={14} /> Transportation Mode
                    </label>
                    <div className="flex gap-3">
                      {TRANSPORT_MODES.map((mode) => (
                        <motion.button
                          key={mode.value}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setTransportMode(mode.value)}
                          className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all duration-300 ${
                            transportMode === mode.value
                              ? "bg-white text-black"
                              : "liquid-glass text-white/70 hover:text-white"
                          }`}
                          style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                          <mode.icon size={20} />
                          <span className="text-xs">{mode.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Navigation Buttons */}
              <FadeIn delay={0.4} className="mt-10 flex items-center justify-between">
                <button
                  onClick={() => router.push("/upload")}
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="group bg-white text-black font-medium px-8 py-3 rounded-full flex items-center gap-3 transition-all duration-300 hover:gap-4 hover:shadow-lg hover:shadow-white/10"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  <Sparkles size={18} />
                  Preview Dataset
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </FadeIn>
            </div>
          </PageTransition>
        </div>
      </div>
    </section>
  );
}
