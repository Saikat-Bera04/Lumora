import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Voyara — Travel Without the Guesswork",
  description:
    "Transform your travel plans into unforgettable experiences. Upload your destinations, set your budget and available time, and let intelligent optimization create the perfect itinerary for you.",
  keywords: ["travel planner", "tourist", "itinerary", "optimization", "DAA", "route optimization", "Voyara"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(0, 0, 0, 0.8)",
              color: "#fff",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
