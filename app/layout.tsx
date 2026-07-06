import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Lumora Planner — Plan Smarter. Travel Better.",
  description:
    "A premium tourist travel planner that generates optimized itineraries using advanced algorithms. Plan your perfect trip with Lumora.",
  keywords: ["travel planner", "tourist", "itinerary", "optimization", "Kolkata"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} h-full antialiased`}>
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
              fontFamily: "system-ui, sans-serif",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
