import type {
  Dataset,
  Preferences,
  OptimizationResult,
  ItineraryStop,
  Attraction,
} from "@/types";
import { buildGraph } from "./graph";
import { dijkstra, allPairsShortestPaths } from "./dijkstra";
import { knapsack, greedyKnapsack } from "./knapsack";
import { nearestNeighborTSP } from "./tsp";

/**
 * Full Optimization Pipeline
 *
 * 1. Build Graph from dataset routes
 * 2. Run Dijkstra (all-pairs shortest paths)
 * 3. Filter attractions by preferred categories
 * 4. Run 0/1 Knapsack to select optimal attractions
 * 5. Run Nearest Neighbor TSP to order the route
 * 6. Generate final itinerary with timing/cost details
 */
export function optimize(
  dataset: Dataset,
  preferences: Preferences
): OptimizationResult {
  // Step 1: Build Graph
  const graph = buildGraph(dataset.routes);

  // Step 2: Compute all-pairs shortest paths
  const allPairs = allPairsShortestPaths(graph);

  // Step 3: Setup candidates and run Knapsack selection
  let candidates = dataset.attractions;
  if (preferences.preferredCategories.length > 0) {
    candidates = candidates.filter((a) =>
      preferences.preferredCategories.includes(a.category)
    );
    if (candidates.length === 0) {
      candidates = dataset.attractions;
    }
  }

  const startDijkstra = dijkstra(graph, preferences.startLocation);
  candidates = candidates.filter((a) => {
    return (
      (startDijkstra.distances.get(a.id) ?? Infinity) < Infinity &&
      a.id !== preferences.startLocation &&
      a.id !== preferences.endLocation
    );
  });

  const avgTravelCost = candidates.length > 0 ? candidates.reduce((sum, a) => sum + (startDijkstra.costs.get(a.id) ?? 0), 0) / candidates.length : 50;
  const travelBudgetEstimate = avgTravelCost * Math.min(preferences.maxAttractions, candidates.length);
  const entryBudget = Math.max(0, preferences.budget - travelBudgetEstimate);

  let selectedAttractions: Attraction[];
  if (candidates.length <= 20 && entryBudget <= 5000) {
    selectedAttractions = knapsack(
      candidates,
      entryBudget,
      preferences.maxTime,
      preferences.maxAttractions
    );
  } else {
    selectedAttractions = greedyKnapsack(
      candidates,
      entryBudget,
      preferences.maxTime,
      preferences.maxAttractions
    );
  }

  // Include start and end in the selection for TSP
  const attractionMap = new Map(dataset.attractions.map((a) => [a.id, a]));
  const start = attractionMap.get(preferences.startLocation);
  if (start) selectedAttractions.push(start);
  
  const end = attractionMap.get(preferences.endLocation);
  if (end && preferences.startLocation !== preferences.endLocation) {
    selectedAttractions.push(end);
  }

  // Step 6: Run TSP — order attractions optimally
  const orderedAttractions = nearestNeighborTSP(
    selectedAttractions,
    preferences.startLocation,
    allPairs,
    preferences.endLocation
  );

  // Step 7: Build detailed itinerary
  const itinerary = buildItinerary(
    orderedAttractions,
    preferences.startLocation,
    allPairs,
    preferences.transportMode
  );

  // Step 8: Calculate summary metrics
  const totalEntryFees = itinerary.reduce(
    (sum, stop) => sum + stop.attraction.entryFee,
    0
  );
  const totalTravelCost = itinerary.reduce(
    (sum, stop) => sum + stop.travelCostFromPrev,
    0
  );
  const totalDistance = itinerary.reduce(
    (sum, stop) => sum + stop.travelDistanceFromPrev,
    0
  );
  const totalTime = itinerary.length > 0
    ? itinerary[itinerary.length - 1].departureTime
    : 0;
  const totalRating = itinerary.reduce(
    (sum, stop) => sum + stop.attraction.rating,
    0
  );
  const totalCost = totalEntryFees + totalTravelCost;
  const categories = [...new Set(itinerary.map((s) => s.attraction.category))];

  return {
    itinerary,
    totalDistance,
    totalTravelCost,
    totalEntryFees,
    totalCost,
    totalTime,
    totalRating,
    budgetUsed: totalCost,
    budgetRemaining: preferences.budget - totalCost,
    attractionsVisited: itinerary.length,
    categories,
  };
}

/**
 * Build a detailed itinerary with timing and cost calculations.
 */
function buildItinerary(
  orderedAttractions: Attraction[],
  startLocation: number,
  allPairs: Map<number, ReturnType<typeof dijkstra>>,
  transportMode: string
): ItineraryStop[] {
  const speedMultiplier = transportMode === "walking" ? 3 : transportMode === "public" ? 1.5 : 1;
  const itinerary: ItineraryStop[] = [];
  let currentTime = 0;
  let currentNode = startLocation;
  let cumulativeDistance = 0;
  let cumulativeCost = 0;

  for (let i = 0; i < orderedAttractions.length; i++) {
    const attraction = orderedAttractions[i];

    // Get travel metrics from current node to this attraction
    let travelDistance = 0;
    let travelCost = 0;

    if (currentNode !== attraction.id) {
      const result = allPairs.get(currentNode);
      if (result) {
        travelDistance = result.distances.get(attraction.id) ?? 0;
        travelCost = result.costs.get(attraction.id) ?? 0;
        
        if (!isFinite(travelDistance)) travelDistance = 0;
        if (!isFinite(travelCost)) travelCost = 0;
      }
    }

    // Estimated travel time (assume avg 30 km/h for auto, 20 for public, 5 for walking)
    const speed = transportMode === "walking" ? 5 : transportMode === "public" ? 20 : 30;
    const travelTime = travelDistance / speed;

    const arrivalTime = currentTime + travelTime;
    const departureTime = arrivalTime + attraction.visitTime;

    cumulativeDistance += travelDistance;
    cumulativeCost += travelCost + attraction.entryFee;

    itinerary.push({
      order: i + 1,
      attraction,
      arrivalTime,
      departureTime,
      travelDistanceFromPrev: travelDistance,
      travelCostFromPrev: travelCost,
      travelTimeFromPrev: travelTime,
      cumulativeDistance,
      cumulativeCost,
    });

    currentTime = departureTime;
    currentNode = attraction.id;
  }

  return itinerary;
}
