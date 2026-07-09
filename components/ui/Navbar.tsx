"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  X,
  Upload,
  Settings2,
  Eye,
  Cpu,
  LayoutDashboard,
  Map,
  BarChart3,
  FileText,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/preferences", label: "Preferences", icon: Settings2 },
  { href: "/preview", label: "Preview", icon: Eye },
  { href: "/processing", label: "Processing", icon: Cpu },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map", label: "Map", icon: Map },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/summary", label: "Summary", icon: FileText },
];

interface NavbarProps {
  /** If true, uses a transparent/floating style (for map page) */
  floating?: boolean;
}

export function Navbar({ floating = false }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav
        className={`flex items-center justify-between px-5 sm:px-8 md:px-12 py-5 sm:py-6 ${floating ? "absolute top-0 left-0 right-0 z-[1000]" : ""
          }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-xl sm:text-2xl italic tracking-tight"
        >
          Lumora
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center">
          <div className="liquid-glass rounded-full flex items-center gap-0.5 px-1.5 py-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5 ${isActive
                      ? "bg-white text-black font-medium"
                      : "text-white/70 hover:text-white"
                    }`}
                  style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                >
                  <Icon size={13} />
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden liquid-glass rounded-xl p-2.5 text-white relative w-10 h-10 flex items-center justify-center"
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

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center"
          style={{ zIndex: 9999 }}
        >
          {/* Close button in top right */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-2"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center gap-4">
            {NAV_ITEMS.map((item, i) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 text-lg transition-all ${isActive ? "text-white" : "text-white/60 hover:text-white"
                    }`}
                  style={{
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                    animation: `fade-in-up 500ms cubic-bezier(0.4,0,0.2,1) ${100 + i * 50
                      }ms both`,
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  {item.label}
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
