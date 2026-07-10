// ── Attraction ──
export interface Attraction {
  id: number;
  name: string;
  category: string;
  entryFee: number;
  visitTime: number; // hours
  rating: number;
}

// ── Route Edge ──
export interface RouteEdge {
  from: number;
  to: number;
  distance: number; // km
  travelCost: number;
}

// ── Parsed Dataset ──
export interface Dataset {
  attractions: Attraction[];
  routes: RouteEdge[];
  filename: string;
  fileSize: number;
}

// ── User Preferences ──
export interface Preferences {
  budget: number;
  maxTime: number; // hours
  startLocation: number; // attraction ID
  endLocation: number; // attraction ID
  preferredCategories: string[];
  transportMode: "walking" | "auto" | "public";
  maxAttractions: number;
}

// ── Graph Types ──
export interface GraphEdge {
  to: number;
  distance: number;
  travelCost: number;
}

export type AdjacencyList = Map<number, GraphEdge[]>;

// ── Dijkstra Result ──
export interface DijkstraResult {
  distances: Map<number, number>;
  costs: Map<number, number>;
  previous: Map<number, number | null>;
}

// ── Itinerary Stop ──
export interface ItineraryStop {
  order: number;
  attraction: Attraction;
  arrivalTime: number; // hours from start
  departureTime: number;
  travelDistanceFromPrev: number;
  travelCostFromPrev: number;
  travelTimeFromPrev: number;
  cumulativeDistance: number;
  cumulativeCost: number;
}

// ── Optimization Result ──
export interface OptimizationResult {
  itinerary: ItineraryStop[];
  totalDistance: number;
  totalTravelCost: number;
  totalEntryFees: number;
  totalCost: number;
  totalTime: number;
  totalRating: number;
  budgetUsed: number;
  budgetRemaining: number;
  attractionsVisited: number;
  categories: string[];
}

// ── Map Coordinate ──
export interface MapCoordinate {
  id: number;
  name: string;
  lat: number;
  lng: number;
  order: number;
}

// ── Trip Summary ──
export interface TripSummary {
  result: OptimizationResult;
  preferences: Preferences;
  dataset: Dataset;
  generatedAt: string;
}

// ── Pipeline Step ──
export interface PipelineStep {
  id: string;
  label: string;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  duration?: number;
}

// ── Chart Data ──
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}
