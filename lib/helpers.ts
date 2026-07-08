import type { MapCoordinate, Attraction } from "@/types";

/**
 * Kolkata-area coordinate map for known attractions.
 * Used to generate map markers when real geocoding isn't available.
 */
const KNOWN_COORDS: Record<string, { lat: number; lng: number }> = {
  // Kolkata
  "victoria memorial": { lat: 22.5448, lng: 88.3426 },
  "science city": { lat: 22.5402, lng: 88.3972 },
  "eco park": { lat: 22.6022, lng: 88.4654 },
  "dakshineswar": { lat: 22.6553, lng: 88.3577 },
  "indian museum": { lat: 22.5582, lng: 88.3508 },
  "howrah bridge": { lat: 22.5851, lng: 88.3468 },
  "birla planetarium": { lat: 22.5436, lng: 88.3427 },
  "marble palace": { lat: 22.5785, lng: 88.3613 },
  "belur math": { lat: 22.6326, lng: 88.3517 },
  "fort william": { lat: 22.5555, lng: 88.3366 },
  "nicco park": { lat: 22.5725, lng: 88.4392 },
  "mother house": { lat: 22.5453, lng: 88.3634 },
  "eden gardens": { lat: 22.5647, lng: 88.3433 },
  "princep ghat": { lat: 22.5562, lng: 88.3299 },
  "jorasanko thakur bari": { lat: 22.5836, lng: 88.3606 },
  "kalighat temple": { lat: 22.5197, lng: 88.3442 },
  "park street": { lat: 22.5527, lng: 88.3534 },
  "aquatica": { lat: 22.5691, lng: 88.4374 },
  "alipore zoo": { lat: 22.5366, lng: 88.3322 },
  "botanical garden": { lat: 22.5569, lng: 88.3072 },
  // Bhubaneswar / Puri
  "lingaraj temple": { lat: 20.2384, lng: 85.8338 },
  "iskcon bhubaneswar": { lat: 20.2982, lng: 85.8242 },
  "jagannath temple": { lat: 19.8135, lng: 85.8312 },
  "rajarani temple": { lat: 20.2415, lng: 85.8364 },
  "dhauli shanti stupa": { lat: 20.1924, lng: 85.8394 },
};

/**
 * Generate map coordinates for attractions.
 * Falls back to generated coordinates if not in the known list.
 */
export function generateCoordinates(
  attractions: Attraction[],
  orderMap?: Map<number, number>
): MapCoordinate[] {
  // Base Kolkata center
  const baseLat = 22.5726;
  const baseLng = 88.3639;

  return attractions.map((a, idx) => {
    const name = a.name.toLowerCase();
    const known = KNOWN_COORDS[name];

    return {
      id: a.id,
      name: a.name,
      lat: known ? known.lat : baseLat + (Math.sin(a.id * 1.5) * 0.05),
      lng: known ? known.lng : baseLng + (Math.cos(a.id * 1.5) * 0.05),
      order: orderMap?.get(a.id) ?? idx + 1,
    };
  });
}

/**
 * Get category color mapping for consistent visualization.
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Museum: "#8B5CF6",
    Science: "#06B6D4",
    Park: "#10B981",
    Temple: "#F59E0B",
    Monument: "#EF4444",
    Entertainment: "#EC4899",
    Historical: "#6366F1",
    Nature: "#22C55E",
    Religious: "#F97316",
    Shopping: "#14B8A6",
  };
  return colors[category] || "#94A3B8";
}

/**
 * Get category icon name (Lucide icon name).
 */
export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Museum: "landmark",
    Science: "flask-conical",
    Park: "trees",
    Temple: "church",
    Monument: "castle",
    Entertainment: "ferris-wheel",
    Historical: "scroll",
    Nature: "mountain",
    Religious: "heart",
    Shopping: "shopping-bag",
  };
  return icons[category] || "map-pin";
}
