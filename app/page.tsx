"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Compass,
  Wallet,
  Clock,
  MapPin,
  BarChart3,
  FileText,
  Upload,
  Settings2,
  Brain,
  Rocket,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useStore } from "@/store/useStore";

/* ────────────────────────────────────────────────
   Data
──────────────────────────────────────────────── */

const FEATURES = [
  {
    emoji: "🧭",
    title: "AI Route Optimization",
    description:
      "Automatically finds the shortest and most efficient route using advanced graph algorithms.",
    icon: Compass,
  },
  {
    emoji: "💰",
    title: "Budget Friendly",
    description:
      "Stay within your travel budget while maximizing your overall experience.",
    icon: Wallet,
  },
  {
    emoji: "⏰",
    title: "Time Optimized",
    description:
      "Generate itineraries that perfectly fit your available schedule.",
    icon: Clock,
  },
  {
    emoji: "📍",
    title: "Interactive Maps",
    description:
      "Visualize your journey with beautiful live maps and optimized travel routes.",
    icon: MapPin,
  },
  {
    emoji: "📊",
    title: "Trip Analytics",
    description:
      "Track travel distance, expenses, time allocation, and destination insights.",
    icon: BarChart3,
  },
  {
    emoji: "📄",
    title: "Smart Reports",
    description:
      "Download and share beautifully organized travel summaries with a single click.",
    icon: FileText,
  },
];

const STEPS = [
  {
    emoji: "📂",
    title: "Upload Dataset",
    description:
      "Import attractions, distances, and travel costs in seconds.",
    icon: Upload,
  },
  {
    emoji: "⚙️",
    title: "Choose Preferences",
    description:
      "Set your budget, available time, travel style, and interests.",
    icon: Settings2,
  },
  {
    emoji: "🧠",
    title: "Optimize",
    description:
      "Our optimization engine applies graph algorithms to find the best travel plan.",
    icon: Brain,
  },
  {
    emoji: "🚀",
    title: "Explore",
    description:
      "Receive your personalized itinerary with maps, analytics, and trip insights.",
    icon: Rocket,
  },
];

const STATS = [
  { value: "15,000+", label: "Optimized Trips" },
  { value: "120+", label: "Tourist Attractions" },
  { value: "98%", label: "User Satisfaction" },
  { value: "AI Powered", label: "Optimization Engine" },
];

const VIDEOS = [
  { url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4", label: "Golden Hour" },
  { url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4", label: "Still Water" },
  { url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4", label: "Deep Woods" },
  { url: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4", label: "Quiet Dawn" },
];

const NAV_LINKS = ["Features", "About", "How It Works"];

/* ────────────────────────────────────────────────
   Animation Helpers
──────────────────────────────────────────────── */

function FadeInSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────
   Main Page
──────────────────────────────────────────────── */

export default function LandingPage() {
  const router = useRouter();
  const { setUserEmail } = useStore();
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % VIDEOS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleStartPlanning = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setUserEmail(email.trim());
    }
    router.push("/upload");
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* ── Background Effects (Global) ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-black" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10">
        {/* ═══════════════ NAVIGATION ═══════════════ */}
        <nav className="flex items-center justify-between px-5 sm:px-8 md:px-12 py-5 sm:py-6">
          <Link href="/" className="text-white text-xl sm:text-2xl italic tracking-tight">
            Voyara
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center">
            <div className="liquid-glass rounded-full flex items-center gap-1 px-2 py-1.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-white/80 text-sm px-4 py-1.5 rounded-full transition-colors duration-200 hover:text-white"
                  style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                >
                  {link}
                </a>
              ))}
              <Link
                href="/upload"
                className="bg-white text-black text-sm font-medium px-5 py-1.5 rounded-full transition-all duration-200 hover:bg-white/90"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden liquid-glass rounded-xl p-2.5 text-white relative w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <Menu
              size={20}
              className="absolute transition-all duration-300"
              style={{
                opacity: mobileMenuOpen ? 0 : 1,
                transform: mobileMenuOpen ? "rotate(90deg) scale(0.75)" : "rotate(0deg) scale(1)",
              }}
            />
            <X
              size={20}
              className="absolute transition-all duration-300"
              style={{
                opacity: mobileMenuOpen ? 1 : 0,
                transform: mobileMenuOpen ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.75)",
              }}
            />
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center"
            style={{ zIndex: 9999 }}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 text-white/70 hover:text-white p-2"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-white text-2xl transition-all"
                  style={{
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    animation: `fade-in-up 500ms cubic-bezier(0.4,0,0.2,1) ${100 + i * 50}ms both`,
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
              <Link
                href="/upload"
                className="bg-white text-black text-lg font-medium px-8 py-3 rounded-full mt-4"
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  animation: "fade-in-up 500ms cubic-bezier(0.4,0,0.2,1) 300ms both",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-5 sm:px-8 pt-8 pb-20 overflow-hidden">
          {/* Background Videos Layer */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-black">
            {VIDEOS.map((video, index) => (
              <video
                key={video.url}
                src={video.url}
                autoPlay
                muted
                loop
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === activeVideo ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            
            {/* Transparent PNG Overlay with Train Bob Animation */}
            <div 
              className="absolute inset-0 w-full h-full bg-[url('https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png')] bg-cover bg-center z-10 animate-train-bob"
            />
            
            {/* Gradient Overlay for Text Readability and Blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black z-20" />
            
            {/* Video Controls / Labels */}
            <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center items-center gap-6 md:gap-10 pointer-events-auto">
              {VIDEOS.map((video, index) => (
                <div
                  key={video.label}
                  onClick={() => setActiveVideo(index)}
                  className={`cursor-pointer transition-all duration-300 ${
                    index === activeVideo ? "text-white scale-110" : "text-white/40 hover:text-white/80"
                  }`}
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  <div className="text-xs uppercase tracking-[0.2em]">{video.label}</div>
                  <div className={`h-[1px] w-full mt-2 transition-all duration-300 ${
                    index === activeVideo ? "bg-white" : "bg-transparent"
                  }`} />
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-20 flex flex-col items-center justify-center w-full">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="liquid-glass badge-shimmer rounded-full px-5 py-2.5 text-xs sm:text-sm text-white/80 mb-8"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              ✨ Trusted by 15,000+ Travelers Planning Smarter Journeys
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] max-w-4xl mb-6 drop-shadow-2xl"
            >
              <span className="gradient-text">Travel Without</span>
              <br />
              <span className="gradient-text-accent">The Guesswork.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-xl text-sm sm:text-base leading-relaxed text-white/80 mb-10 drop-shadow-md"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Transform your travel plans into unforgettable experiences.
              Upload your destinations, set your budget and available time,
              and let intelligent optimization create the perfect itinerary for you.
            </motion.p>

            {/* Email Input */}
            <motion.form
              onSubmit={handleStartPlanning}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="liquid-glass rounded-full flex items-center p-1.5 w-full max-w-[360px] sm:max-w-md mb-5"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm px-4 py-2.5 outline-none text-white placeholder:text-white/60"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              />
              <button
                type="submit"
                className="bg-white text-black text-sm font-medium px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 hover:bg-white/90 flex items-center gap-2"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                <Sparkles size={14} />
                Start Planning
              </button>
            </motion.form>

            {/* Secondary Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/upload"
                className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-2 drop-shadow-sm"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Explore Demo
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="section-divider max-w-6xl mx-auto" />

        {/* ═══════════════ FEATURES SECTION ═══════════════ */}
        <section id="features" className="py-24 sm:py-32 px-5 sm:px-8 md:px-12">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">
              Everything You Need
              <br />
              <span className="gradient-text-accent">For Smarter Travel</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {FEATURES.map((feature, i) => (
              <FadeInSection key={feature.title} delay={i * 0.1}>
                <div className="liquid-glass feature-card rounded-2xl p-7 h-full">
                  <div className="text-3xl mb-4">{feature.emoji}</div>
                  <h3
                    className="text-white text-lg mb-2"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-white/50 text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    {feature.description}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="section-divider max-w-6xl mx-auto" />

        {/* ═══════════════ ABOUT SECTION ═══════════════ */}
        <section id="about" className="py-24 sm:py-32 px-5 sm:px-8 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <FadeInSection>
              <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6 leading-tight">
                Powered by{" "}
                <span className="gradient-text-accent">Intelligent Algorithms.</span>
                <br />
                Designed for Real Travelers.
              </h2>
            </FadeInSection>
            <FadeInSection delay={0.15}>
              <p
                className="text-white/55 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Voyara combines powerful optimization algorithms with a premium user
                experience to help travelers create efficient, budget-conscious, and
                memorable journeys. Whether you&apos;re exploring a new city or planning a
                weekend getaway, every itinerary is crafted intelligently.
              </p>
            </FadeInSection>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="section-divider max-w-6xl mx-auto" />

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section id="how-it-works" className="py-24 sm:py-32 px-5 sm:px-8 md:px-12">
          <FadeInSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">
              How It <span className="gradient-text-accent">Works</span>
            </h2>
          </FadeInSection>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step, i) => (
                <FadeInSection key={step.title} delay={i * 0.12}>
                  <div className="flex flex-col items-center text-center">
                    {/* Step Number */}
                    <div className="liquid-glass rounded-2xl w-20 h-20 flex items-center justify-center text-3xl mb-5 animate-pulse-glow">
                      {step.emoji}
                    </div>

                    {/* Step Label */}
                    <div
                      className="text-white/30 text-xs uppercase tracking-widest mb-2"
                      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                    >
                      Step {i + 1}
                    </div>

                    <h3
                      className="text-white text-base mb-2"
                      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-white/45 text-sm leading-relaxed"
                      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="section-divider max-w-6xl mx-auto" />

        {/* ═══════════════ STATISTICS ═══════════════ */}
        <section className="py-24 sm:py-28 px-5 sm:px-8 md:px-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {STATS.map((stat, i) => (
                <FadeInSection key={stat.label} delay={i * 0.1}>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl text-white mb-2 stat-value gradient-text">
                      {stat.value}
                    </div>
                    <div
                      className="text-white/40 text-xs sm:text-sm uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                    >
                      {stat.label}
                    </div>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="section-divider max-w-6xl mx-auto" />

        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer className="py-20 sm:py-24 px-5 sm:px-8 md:px-12">
          <div className="max-w-3xl mx-auto text-center">
            {/* Quote */}
            <FadeInSection>
              <blockquote className="text-xl sm:text-2xl md:text-3xl text-white/80 leading-relaxed mb-8">
                &ldquo;Travel is not about reaching destinations.
                <br />
                It&apos;s about making every stop meaningful.&rdquo;
              </blockquote>
            </FadeInSection>

            {/* CTA */}
            <FadeInSection delay={0.15}>
              <Link
                href="/upload"
                className="inline-flex items-center gap-3 bg-white text-black font-medium px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 mb-12"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                <Sparkles size={18} />
                Start Your Journey
                <ArrowRight size={18} />
              </Link>
            </FadeInSection>

            {/* Divider */}
            <div className="section-divider mb-8" />

            {/* Brand */}
            <FadeInSection delay={0.25}>
              <p
                className="text-white/25 text-xs sm:text-sm mb-2"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Built with <Heart size={12} className="inline text-red-400 fill-red-400" /> using Next.js, TypeScript and DAA Algorithms.
              </p>
              <p className="text-white/15 text-xs" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                © {new Date().getFullYear()} Voyara — Travel Without the Guesswork.
              </p>
            </FadeInSection>
          </div>
        </footer>
      </div>
    </div>
  );
}
