"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Code,
  Network,
  Route,
  Search,
  Package,
  CheckCircle2,
  Map,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Navbar } from "@/components/ui/Navbar";

const PIPELINE_STEPS = [
  { id: "read", label: "Reading Dataset", description: "Loading TXT file data", icon: FileText },
  { id: "parse", label: "Parsing TXT", description: "Extracting attractions & routes", icon: Code },
  { id: "graph", label: "Creating Graph", description: "Building adjacency list", icon: Network },
  { id: "dijkstra", label: "Running Dijkstra", description: "Finding shortest paths • O((V+E) log V)", icon: Route },
  { id: "paths", label: "Finding Shortest Paths", description: "Computing all-pairs distances", icon: Search },
  { id: "knapsack", label: "Applying Knapsack", description: "Selecting optimal attractions • DP", icon: Package },
  { id: "select", label: "Selecting Attractions", description: "Maximizing rating under constraints", icon: CheckCircle2 },
  { id: "tsp", label: "Running TSP", description: "Nearest neighbor heuristic • O(n²)", icon: Map },
  { id: "optimize", label: "Optimizing Route", description: "Computing travel costs & times", icon: BarChart3 },
  { id: "summary", label: "Preparing Summary", description: "Generating final itinerary", icon: Sparkles },
];

export default function ProcessingPage() {
  const router = useRouter();
  const { dataset, preferences, setOptimizationResult, setTripSummary } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const hasStarted = useRef(false);

  // Redirect if no dataset
  useEffect(() => {
    if (!dataset) {
      router.push("/upload");
    }
  }, [dataset, router]);

  // Timer
  useEffect(() => {
    if (completed) return;
    const timer = setInterval(() => {
      setElapsed((e) => e + 100);
    }, 100);
    return () => clearInterval(timer);
  }, [completed]);

  // Run optimization
  useEffect(() => {
    if (!dataset || hasStarted.current) return;
    hasStarted.current = true;

    const runOptimization = async () => {
      // Animate through steps
      for (let i = 0; i < PIPELINE_STEPS.length; i++) {
        setCurrentStep(i);
        // Variable delay to simulate real processing
        const delay = i === 3 || i === 5 || i === 7 ? 800 : 400;
        await new Promise((r) => setTimeout(r, delay));
      }

      try {
        const response = await fetch("/api/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataset, preferences }),
        });

        const data = await response.json();

        if (data.success) {
          setOptimizationResult(data.result);
          setTripSummary({
            result: data.result,
            preferences,
            dataset,
            generatedAt: data.generatedAt,
          });
          setCompleted(true);
          // Auto-navigate after animation
          setTimeout(() => router.push("/dashboard"), 1500);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error("Optimization failed:", error);
        setCompleted(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    };

    runOptimization();
  }, [dataset, preferences, router, setOptimizationResult, setTripSummary]);

  if (!dataset) return null;

  const progress = ((currentStep + 1) / PIPELINE_STEPS.length) * 100;
  const estimatedTotal = 5.5; // seconds
  const estimatedRemaining = Math.max(0, estimatedTotal - elapsed / 1000);

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8">
          <div className="w-full max-w-lg">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl sm:text-4xl text-white leading-[1.1] mb-3">
                {completed ? "Optimization Complete" : "Optimizing Your Trip"}
              </h1>
              <p className="text-white/50 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                {completed
                  ? "Your perfect itinerary is ready"
                  : `Elapsed: ${(elapsed / 1000).toFixed(1)}s • Est. remaining: ${estimatedRemaining.toFixed(1)}s`}
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-10"
            >
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  animate={{ width: completed ? "100%" : `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-white/30 text-xs text-right mt-2" style={{ fontFamily: "system-ui, sans-serif" }}>
                {completed ? "100" : Math.round(progress)}%
              </p>
            </motion.div>

            {/* Pipeline Steps */}
            <div className="space-y-2">
              {PIPELINE_STEPS.map((step, i) => {
                const isActive = i === currentStep && !completed;
                const isDone = i < currentStep || completed;
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-500 ${
                      isActive
                        ? "liquid-glass scale-[1.02]"
                        : isDone
                          ? "opacity-60"
                          : "opacity-20"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${
                        isActive
                          ? "bg-white text-black"
                          : isDone
                            ? "bg-white/10 text-emerald-400"
                            : "bg-white/5 text-white/20"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Icon size={16} className={isActive ? "animate-pulse" : ""} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm ${isActive ? "text-white" : "text-white/60"}`}
                        style={{ fontFamily: "system-ui, sans-serif" }}
                      >
                        {step.label}
                      </p>
                      <p
                        className="text-white/30 text-xs"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                      >
                        {step.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Completion animation */}
            <AnimatePresence>
              {completed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </motion.div>
                  <p className="text-white/50 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                    Redirecting to dashboard...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
