"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  Printer,
  Share2,
  RotateCcw,
  Star,
  MapPin,
  Clock,
  Wallet,
  Route,
  ArrowDown,
  Ticket,
  PiggyBank,
  Image as ImageIcon,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Navbar } from "@/components/ui/Navbar";
import { PageTransition, FadeIn } from "@/components/ui/PageTransition";
import toast from "react-hot-toast";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";

export default function SummaryPage() {
  const router = useRouter();
  const { optimizationResult, tripSummary, reset } = useStore();
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!optimizationResult) router.push("/upload");
  }, [optimizationResult, router]);

  if (!optimizationResult || !tripSummary) return null;

  const r = optimizationResult;
  const pref = tripSummary.preferences;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    toast.loading("Generating PDF...", { id: "pdf" });
    try {
      const element = printRef.current;
      if (!element) return;

      const imgData = await htmlToImage.toPng(element, {
        backgroundColor: "#000000",
        pixelRatio: 2,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      // For html-to-image, we can get the dimensions directly from the element,
      // but since we scaled by pixelRatio=2, the rendered image is twice the element's size.
      // We'll calculate the aspect ratio to fit A4 width.
      const aspect = element.offsetHeight / element.offsetWidth;
      const imgHeight = aspect * imgWidth;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("Lumora-trip-summary.pdf");
      toast.success("PDF downloaded!", { id: "pdf" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF", { id: "pdf" });
    }
  };

  const handleDownloadImage = async () => {
    toast.loading("Generating image...", { id: "img" });
    try {
      const element = printRef.current;
      if (!element) return;

      const dataUrl = await htmlToImage.toPng(element, {
        backgroundColor: "#000000",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = "Lumora-trip-summary.png";
      link.href = dataUrl;
      link.click();
      toast.success("Image downloaded!", { id: "img" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate image", { id: "img" });
    }
  };

  const handleShare = async () => {
    const text = `Check out my optimized trip plan from Lumora!\n\n${r.attractionsVisited} attractions • ${r.totalDistance.toFixed(1)} km • ₹${r.totalCost} total cost`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Lumora Trip Plan", text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  const handleRestart = () => {
    reset();
    router.push("/upload");
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="print:hidden">
          <Navbar />
        </div>

        <div className="flex-1 px-5 sm:px-8 md:px-12 pb-20">
          <PageTransition>
            <FadeIn className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-white leading-[1.1] mb-4">
                Trip Summary
              </h1>
              <p className="text-white/60 text-sm max-w-md mx-auto"
                style={{ fontFamily: "system-ui, sans-serif" }}>
                Your complete itinerary report, ready to download or share.
              </p>
            </FadeIn>

            {/* Action Buttons */}
            <FadeIn delay={0.1} className="flex justify-center gap-3 mb-10 print:hidden flex-wrap">
              <button
                onClick={handleDownload}
                className="liquid-glass rounded-full px-5 py-2.5 text-white/70 text-sm flex items-center gap-2 hover:text-white transition-all hover:scale-105"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                <Download size={16} /> Download PDF
              </button>
              <button
                onClick={handleDownloadImage}
                className="liquid-glass rounded-full px-5 py-2.5 text-white/70 text-sm flex items-center gap-2 hover:text-white transition-all hover:scale-105"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                <ImageIcon size={16} /> Download Image
              </button>
              <button
                onClick={handlePrint}
                className="liquid-glass rounded-full px-5 py-2.5 text-white/70 text-sm flex items-center gap-2 hover:text-white transition-all hover:scale-105"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                <Printer size={16} /> Print
              </button>
              <button
                onClick={handleShare}
                className="liquid-glass rounded-full px-5 py-2.5 text-white/70 text-sm flex items-center gap-2 hover:text-white transition-all hover:scale-105"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                <Share2 size={16} /> Share
              </button>
              <button
                onClick={handleRestart}
                className="bg-white text-black rounded-full px-5 py-2.5 text-sm flex items-center gap-2 transition-all hover:scale-105"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                <RotateCcw size={16} /> New Trip
              </button>
            </FadeIn>

            {/* Report Content */}
            <div ref={printRef} className="max-w-3xl mx-auto">
              {/* Overview Cards */}
              <FadeIn delay={0.15}>
                <div className="liquid-glass rounded-2xl p-6 mb-5">
                  <h2 className="text-white text-xl mb-5">Overview</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Attractions", value: r.attractionsVisited, icon: MapPin },
                      { label: "Distance", value: `${r.totalDistance.toFixed(1)} km`, icon: Route },
                      { label: "Duration", value: `${r.totalTime.toFixed(1)}h`, icon: Clock },
                      { label: "Total Rating", value: `${r.totalRating}★`, icon: Star },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <item.icon size={18} className="text-white/30 mx-auto mb-2" />
                        <p className="text-white text-xl">{item.value}</p>
                        <p className="text-white/40 text-xs mt-1" style={{ fontFamily: "system-ui, sans-serif" }}>
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Budget Breakdown */}
              <FadeIn delay={0.2}>
                <div className="liquid-glass rounded-2xl p-6 mb-5">
                  <h2 className="text-white text-xl mb-5">Budget Breakdown</h2>
                  <div className="space-y-3" style={{ fontFamily: "system-ui, sans-serif" }}>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 flex items-center gap-2"><Ticket size={14} /> Entry Fees</span>
                      <span className="text-white">₹{r.totalEntryFees}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 flex items-center gap-2"><Route size={14} /> Travel Cost</span>
                      <span className="text-white">₹{r.totalTravelCost}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                      <span className="text-white/60 flex items-center gap-2"><Wallet size={14} /> Total Expense</span>
                      <span className="text-white font-medium">₹{r.totalCost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 flex items-center gap-2"><PiggyBank size={14} /> Budget Remaining</span>
                      <span className={r.budgetRemaining >= 0 ? "text-emerald-400" : "text-red-400"}>
                        ₹{r.budgetRemaining}
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Itinerary Timeline */}
              <FadeIn delay={0.25}>
                <div className="liquid-glass rounded-2xl p-6 mb-5">
                  <h2 className="text-white text-xl mb-5">Itinerary</h2>
                  <div className="space-y-0">
                    {r.itinerary.map((stop, i) => (
                      <div key={stop.order}>
                        <div className="flex items-start gap-4 py-3">
                          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-xs font-medium shrink-0 mt-0.5"
                            style={{ fontFamily: "system-ui, sans-serif" }}>
                            {stop.order}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white text-base">{stop.attraction.name}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                              <span className="text-white/40 text-xs">{stop.attraction.category}</span>
                              <span className="text-white/40 text-xs">₹{stop.attraction.entryFee} entry</span>
                              <span className="text-white/40 text-xs">{stop.attraction.visitTime}h visit</span>
                              <span className="text-amber-400/70 text-xs flex items-center gap-0.5">
                                <Star size={10} fill="currentColor" /> {stop.attraction.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        {i < r.itinerary.length - 1 && (
                          <div className="flex items-center gap-4 pl-3">
                            <div className="w-2 flex justify-center">
                              <div className="w-px h-6 bg-white/10" />
                            </div>
                            <span className="text-white/20 text-[10px] flex items-center gap-1"
                              style={{ fontFamily: "system-ui, sans-serif" }}>
                              <ArrowDown size={8} />
                              {r.itinerary[i + 1].travelDistanceFromPrev.toFixed(1)} km •{" "}
                              ₹{r.itinerary[i + 1].travelCostFromPrev} •{" "}
                              {(r.itinerary[i + 1].travelTimeFromPrev * 60).toFixed(0)} min
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Preferences Used */}
              <FadeIn delay={0.3}>
                <div className="liquid-glass rounded-2xl p-6">
                  <h2 className="text-white text-xl mb-5">Settings Used</h2>
                  <div className="grid grid-cols-2 gap-3" style={{ fontFamily: "system-ui, sans-serif" }}>
                    <div>
                      <p className="text-white/40 text-xs">Budget</p>
                      <p className="text-white text-sm mt-1">₹{pref.budget}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Max Time</p>
                      <p className="text-white text-sm mt-1">{pref.maxTime}h</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Transport</p>
                      <p className="text-white text-sm mt-1 capitalize">{pref.transportMode}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Max Stops</p>
                      <p className="text-white text-sm mt-1">{pref.maxAttractions}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Footer */}
              <FadeIn delay={0.35} className="mt-8 text-center">
                <p className="text-white/20 text-xs" style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
                  Generated by Lumora •{" "}
                  {new Date(tripSummary.generatedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </FadeIn>
            </div>
          </PageTransition>
        </div>
      </div>
    </section>
  );
}
