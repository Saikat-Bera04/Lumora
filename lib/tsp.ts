import type { Attraction, AdjacencyList, DijkstraResult } from "@/types";

/**
 * Nearest Neighbor TSP Heuristic
 *
 * Orders selected attractions into an optimal visiting sequence
 * by always visiting the nearest unvisited attraction.
 *
 * Time Complexity: O(n²)
 *
 * @param attractions - Selected attractions to order
 * @param startId - Starting attraction ID
 * @param allPairs - Pre-computed all-pairs shortest paths
 * @returns Ordered array of attractions representing the optimal route
 */
export function nearestNeighborTSP(
  attractions: Attraction[],
  startId: number,
  allPairs: Map<number, DijkstraResult>
): Attraction[] {
  if (attractions.length <= 1) return [...attractions];

  const unvisited = new Set(attractions.map((a) => a.id));
  const ordered: Attraction[] = [];
  const attractionMap = new Map(attractions.map((a) => [a.id, a]));

  let currentId = startId;

  // If startId is one of the attractions, visit it first
  if (unvisited.has(currentId)) {
    unvisited.delete(currentId);
    const startAttraction = attractionMap.get(currentId);
    if (startAttraction) ordered.push(startAttraction);
  }

  while (unvisited.size > 0) {
    let nearestId = -1;
    let nearestDist = Infinity;

    const dijkstraResult = allPairs.get(currentId);

    for (const candidateId of unvisited) {
      let dist = Infinity;

      if (dijkstraResult) {
        dist = dijkstraResult.distances.get(candidateId) ?? Infinity;
      }

      if (dist < nearestDist) {
        nearestDist = dist;
        nearestId = candidateId;
      }
    }

    if (nearestId === -1) {
      // Remaining nodes are unreachable — add them in original order
      for (const id of unvisited) {
        const a = attractionMap.get(id);
        if (a) ordered.push(a);
      }
      break;
    }

    unvisited.delete(nearestId);
    const attraction = attractionMap.get(nearestId);
    if (attraction) ordered.push(attraction);
    currentId = nearestId;
  }

  return ordered;
}

/**
 * Calculate total route distance for a given ordering.
 */
export function calculateRouteDistance(
  orderedIds: number[],
  allPairs: Map<number, DijkstraResult>
): number {
  let total = 0;

  for (let i = 0; i < orderedIds.length - 1; i++) {
    const from = orderedIds[i];
    const to = orderedIds[i + 1];
    const result = allPairs.get(from);
    if (result) {
      total += result.distances.get(to) ?? 0;
    }
  }

  return total;
}

/**
 * Calculate total route travel cost for a given ordering.
 */
export function calculateRouteCost(
  orderedIds: number[],
  allPairs: Map<number, DijkstraResult>
): number {
  let total = 0;

  for (let i = 0; i < orderedIds.length - 1; i++) {
    const from = orderedIds[i];
    const to = orderedIds[i + 1];
    const result = allPairs.get(from);
    if (result) {
      total += result.costs.get(to) ?? 0;
    }
  }

  return total;
}
