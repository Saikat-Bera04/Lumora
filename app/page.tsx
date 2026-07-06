"use client";

import { useState, useCallback, useRef } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const VIDEOS = [
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081127_0992a171-d3c6-4978-8213-0ec5df8b6d63.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_092026_dd05b805-ea0f-40b2-8c52-332b88502592.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_081042_df7202bf-bd80-4b2b-bbc6-1f09ba2870e9.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260702_080959_4cac5234-3573-464e-a5b7-76b94b8a7d61.mp4",
];

const VIDEO_LABELS = ["Golden Hour", "Still Water", "Deep Woods", "Quiet Dawn"];

const NAV_LINKS = ["How It Works", "Features", "Pricing", "Community"];

const STATS = [
  "60+ Deep Sessions",
  "12,000+ Creators",
  "4.8 User Satisfaction",
  "Intentional-First Design",
];

const OVERLAY_IMAGE =
  "https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png";

export default function LandingPage() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleVideoSwitch = useCallback(
    (index: number) => {
      if (index === activeVideo || isTransitioning) return;
      setActiveVideo(index);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 1000);
    },
    [activeVideo, isTransitioning]
  );

  // Dark mode for Deep Woods (index 2)
  const isDarkContent = activeVideo === 2;
  const contentColor = isDarkContent ? "#182C41" : "#ffffff";

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* ── Video Background Layer ── */}
      {VIDEOS.map((src, i) => (
        <video
          key={i}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            i === activeVideo ? "opacity-100" : "opacity-0"
          }`}
          style={{ zIndex: 0 }}
        />
      ))}

      {/* ── PNG Overlay (z-index 1) ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={OVERLAY_IMAGE}
        alt=""
        className="absolute inset-0 w-full h-full object-cover animate-train-bob pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* ── Content Layer (z-index 2) ── */}
      <div
        className="relative flex flex-col h-full px-5 sm:px-8 md:px-12 py-5 sm:py-6"
        style={{ zIndex: 2 }}
      >
        {/* ── Navigation ── */}
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-white text-xl sm:text-2xl italic tracking-tight"
          >
            Lumora
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            <div className="liquid-glass rounded-full flex items-center gap-1 px-2 py-1.5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-white/90 text-sm px-4 py-1.5 rounded-full transition-colors duration-200 hover:text-white"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {link}
                </a>
              ))}
              <Link
                href="/upload"
                className="bg-white text-black text-sm font-medium px-5 py-1.5 rounded-full transition-all duration-200 hover:bg-white/90"
                style={{ fontFamily: "system-ui, sans-serif" }}
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
                transform: mobileMenuOpen
                  ? "rotate(90deg) scale(0.75)"
                  : "rotate(0deg) scale(1)",
              }}
            />
            <X
              size={20}
              className="absolute transition-all duration-300"
              style={{
                opacity: mobileMenuOpen ? 1 : 0,
                transform: mobileMenuOpen
                  ? "rotate(0deg) scale(1)"
                  : "rotate(-90deg) scale(0.75)",
              }}
            />
          </button>
        </nav>

        {/* ── Mobile Menu Overlay ── */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            style={{ zIndex: 50 }}
          >
            <div className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-white text-3xl transition-all"
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    animation: `fade-in-up 500ms cubic-bezier(0.4,0,0.2,1) ${
                      100 + i * 50
                    }ms both`,
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
              <Link
                href="/upload"
                className="bg-white text-black text-xl font-medium px-8 py-3 rounded-full mt-4"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  animation:
                    "fade-in-up 500ms cubic-bezier(0.4,0,0.2,1) 300ms both",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}

        {/* ── Hero Content ── */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 sm:gap-8 mt-4">
          {/* Badge */}
          <div
            className="liquid-glass rounded-full px-5 py-2 text-xs sm:text-sm transition-colors duration-700"
            style={{
              color: contentColor,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Over 10,000 minds already finding their clarity
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] max-w-4xl transition-colors duration-700"
            style={{ color: contentColor }}
          >
            Clarity in an Endlessly
            <br />
            Noisy Universe
          </h1>

          {/* Subtext */}
          <p
            className="max-w-xl text-sm sm:text-base leading-relaxed transition-colors duration-700"
            style={{
              color: isDarkContent
                ? "rgba(24,44,65,0.8)"
                : "rgba(255,255,255,0.75)",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Rise above the chaos of pings, infinite scrolling, and relentless
            demands. Discover how to protect your presence and create with
            intention.
          </p>

          {/* Email Input */}
          <div className="liquid-glass rounded-full flex items-center p-1.5 w-full max-w-[320px] sm:max-w-sm">
            <input
              type="email"
              placeholder="Your Best Email"
              className="flex-1 bg-transparent text-sm px-4 py-2 outline-none transition-colors duration-700"
              style={{
                color: contentColor,
                fontFamily: "system-ui, sans-serif",
              }}
            />
            <Link
              href="/upload"
              className="bg-white text-black text-sm font-medium px-4 sm:px-5 py-2 rounded-full whitespace-nowrap transition-all duration-200 hover:bg-white/90"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Get Early Access
            </Link>
          </div>

          {/* Video Switcher */}
          <div className="flex items-center gap-4 sm:gap-6 mt-2">
            {VIDEO_LABELS.map((label, i) => (
              <button
                key={label}
                onClick={() => handleVideoSwitch(i)}
                className="text-xs sm:text-sm pb-1.5 transition-all duration-300 border-b-2"
                style={{
                  fontFamily: "system-ui, sans-serif",
                  color:
                    i === activeVideo
                      ? contentColor
                      : isDarkContent
                        ? "rgba(24,44,65,0.5)"
                        : "rgba(255,255,255,0.5)",
                  borderColor:
                    i === activeVideo
                      ? contentColor
                      : "transparent",
                  opacity: i === activeVideo ? 1 : undefined,
                }}
                onMouseEnter={(e) => {
                  if (i !== activeVideo) {
                    e.currentTarget.style.color = isDarkContent
                      ? "rgba(24,44,65,0.8)"
                      : "rgba(255,255,255,0.8)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (i !== activeVideo) {
                    e.currentTarget.style.color = isDarkContent
                      ? "rgba(24,44,65,0.5)"
                      : "rgba(255,255,255,0.5)";
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Bottom Stats ── */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pb-4">
          {STATS.map((stat, i) => (
            <span key={stat} className="flex items-center gap-4">
              <span
                className="text-white/70 text-xs sm:text-sm"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {stat}
              </span>
              {i < STATS.length - 1 && (
                <span className="text-white/30 hidden sm:inline">|</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
