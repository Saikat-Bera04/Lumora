import type { MapCoordinate, Attraction, ItineraryStop } from "@/types";

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
 * Generate map coordinates for itinerary stops.
 * Uses the dataset's travel distances to generate relative coordinates.
 */
export function generateCoordinates(
  itinerary: ItineraryStop[]
): MapCoordinate[] {
  // Base coordinate (could be anything, let's use a nice default)
  let currentLat = 22.5726; // Kolkata center
  let currentLng = 88.3639;
  let currentAngle = 0;

  return itinerary.map((stop, idx) => {
    if (idx === 0) {
      // First stop can try to use known coords to ground the map if available
      const name = stop.attraction.name.toLowerCase();
      const known = KNOWN_COORDS[name];
      if (known) {
        currentLat = known.lat;
        currentLng = known.lng;
      }
    } else {
      // For subsequent stops, place them relative to previous based on dataset distance
      const distKm = stop.travelDistanceFromPrev;
      const distDeg = distKm / 111.0; // rough approximation: 1 deg = 111 km

      // Vary the angle slightly so it doesn't just form a straight line
      currentAngle += (Math.PI / 4) + (Math.sin(idx) * 0.2); // ~45 deg + some variation

      currentLat += distDeg * Math.cos(currentAngle);
      currentLng += distDeg * Math.sin(currentAngle);
    }

    return {
      id: stop.attraction.id,
      name: stop.attraction.name,
      lat: currentLat,
      lng: currentLng,
      order: stop.order,
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
