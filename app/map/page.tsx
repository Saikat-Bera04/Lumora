"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { MapPin, Route, Wallet, Clock, Navigation } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Navbar } from "@/components/ui/Navbar";
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
const MapBounds = dynamic(
  () => import("@/components/ui/MapBounds").then((m) => m.MapBounds),
  { ssr: false }
);

export default function MapPage() {
  const router = useRouter();
  const { optimizationResult } = useStore();

  useEffect(() => {
    if (!optimizationResult) {
      router.push("/upload");
      return;
    }
    
    // Fix Leaflet default icon
    (async function init() {
      const L = await import("leaflet");
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      (window as any).L = L;
    })();
  }, [optimizationResult, router]);

  // Generate coordinates for itinerary stops
  const coordinates = useMemo(() => {
    if (!optimizationResult) return [];
    return generateCoordinates(optimizationResult.itinerary);
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
                weight: 4,
                opacity: 0.8,
                dashArray: "10, 15",
                className: "animate-dash", // Assumes global CSS for dash animation if desired
              }}
            />
          )}

          {/* Markers */}
          {coordinates.map((coord) => {
            // Create a custom numbered icon safely
            const L = typeof window !== 'undefined' ? (window as any).L : undefined;
            const customIcon = L ? new L.DivIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: white; color: black; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3); font-family: system-ui, sans-serif;">${coord.order}</div>`,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            }) : undefined;

            return (
              <Marker 
                key={coord.id} 
                position={[coord.lat, coord.lng]}
                {...(customIcon ? { icon: customIcon } : {})}
              >
                <Popup className="custom-popup">
                  <div style={{ fontFamily: "system-ui, sans-serif" }}>
                    <strong>{coord.name}</strong>
                    <br />
                    Stop #{coord.order}
                  </div>
                </Popup>
              </Marker>
            );
          })}
          
          <MapBounds coordinates={coordinates} />
        </MapContainer>
      </div>

      {/* Floating Nav */}
      <div className="absolute top-0 left-0 right-0 z-[1000]">
        <Navbar floating />
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
