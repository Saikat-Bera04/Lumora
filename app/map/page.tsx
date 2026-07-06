"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Route, Wallet, Clock, Navigation } from "lucide-react";
import { useStore } from "@/store/useStore";
import { generateCoordinates } from "@/lib/helpers";
import { FadeIn } from "@/components/ui/PageTransition";

// Dynamic import for Leaflet (no SSR)
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

export default function MapPage() {
  const router = useRouter();
  const { optimizationResult } = useStore();

  useEffect(() => {
    if (!optimizationResult) router.push("/upload");
  }, [optimizationResult, router]);

  // Generate coordinates for itinerary stops
  const coordinates = useMemo(() => {
    if (!optimizationResult) return [];
    const orderMap = new Map(
      optimizationResult.itinerary.map((s) => [s.attraction.id, s.order])
    );
    return generateCoordinates(
      optimizationResult.itinerary.map((s) => s.attraction),
      orderMap
    );
  }, [optimizationResult]);

  if (!optimizationResult) return null;

  const center: [number, number] = coordinates.length > 0
    ? [
        coordinates.reduce((s, c) => s + c.lat, 0) / coordinates.length,
        coordinates.reduce((s, c) => s + c.lng, 0) / coordinates.length,
      ]
    : [22.5726, 88.3639];

  const routePath: [number, number][] = coordinates.map((c) => [c.lat, c.lng]);

  return (
    <section className="relative h-screen bg-black overflow-hidden">
      {/* Import leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />

      {/* Map */}
      <div className="absolute inset-0">
        <MapContainer
          center={center}
          zoom={12}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Route line */}
          {routePath.length > 1 && (
            <Polyline
              positions={routePath}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                opacity: 0.6,
                dashArray: "10, 10",
              }}
            />
          )}

          {/* Markers */}
          {coordinates.map((coord) => (
            <Marker key={coord.id} position={[coord.lat, coord.lng]}>
              <Popup>
                <div style={{ fontFamily: "system-ui, sans-serif" }}>
                  <strong>{coord.name}</strong>
                  <br />
                  Stop #{coord.order}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Floating Nav */}
      <div className="absolute top-0 left-0 right-0 z-[1000] px-5 sm:px-8 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-white text-xl sm:text-2xl italic drop-shadow-lg">
            Lumora
          </Link>
          <Link
            href="/dashboard"
            className="liquid-glass rounded-full px-4 py-2 text-white/70 text-xs flex items-center gap-2 hover:text-white transition-all"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            <ArrowLeft size={14} /> Dashboard
          </Link>
        </div>
      </div>

      {/* Floating Legend */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-6 left-5 right-5 sm:left-8 sm:right-auto z-[1000]"
      >
        <div className="liquid-glass rounded-2xl p-5 sm:min-w-[320px]"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}>
          <h3 className="text-white text-lg mb-4 flex items-center gap-2">
            <Navigation size={16} />
            Route Overview
          </h3>

          <div className="space-y-3">
            {optimizationResult.itinerary.map((stop, i) => (
              <div key={stop.order} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-xs font-medium shrink-0"
                  style={{ fontFamily: "system-ui, sans-serif" }}>
                  {stop.order}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {stop.attraction.name}
                  </p>
                  {i > 0 && (
                    <p className="text-white/30 text-[10px]" style={{ fontFamily: "system-ui, sans-serif" }}>
                      {stop.travelDistanceFromPrev.toFixed(1)} km • ₹{stop.travelCostFromPrev}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t border-white/10 mt-4 pt-4 grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-white text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                {optimizationResult.totalDistance.toFixed(1)} km
              </p>
              <p className="text-white/30 text-[10px]" style={{ fontFamily: "system-ui, sans-serif" }}>
                Distance
              </p>
            </div>
            <div className="text-center">
              <p className="text-white text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                ₹{optimizationResult.totalCost}
              </p>
              <p className="text-white/30 text-[10px]" style={{ fontFamily: "system-ui, sans-serif" }}>
                Total Cost
              </p>
            </div>
            <div className="text-center">
              <p className="text-white text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                {optimizationResult.totalTime.toFixed(1)}h
              </p>
              <p className="text-white/30 text-[10px]" style={{ fontFamily: "system-ui, sans-serif" }}>
                Duration
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
