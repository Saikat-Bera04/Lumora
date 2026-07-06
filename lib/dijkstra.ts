import type { AdjacencyList, DijkstraResult } from "@/types";

/**
 * Dijkstra's Shortest Path Algorithm
 *
 * Finds shortest distances and lowest travel costs from a source node
 * to all reachable nodes in a weighted graph.
 *
 * Time Complexity: O((V + E) log V) using a min-heap priority queue.
 *
 * @param graph - Adjacency list representation of the graph
 * @param source - Source node ID
 * @returns DijkstraResult with distances, costs, and previous-node maps
 */
export function dijkstra(graph: AdjacencyList, source: number): DijkstraResult {
  const distances = new Map<number, number>();
  const costs = new Map<number, number>();
  const previous = new Map<number, number | null>();
  const visited = new Set<number>();

  // Priority queue as sorted array (min-heap simulation)
  // In production, use a proper binary heap for O(log n) operations
  const pq: Array<{ node: number; distance: number }> = [];

  // Initialize all nodes with infinity distance
  for (const node of graph.keys()) {
    distances.set(node, Infinity);
    costs.set(node, Infinity);
    previous.set(node, null);
  }

  // Source node initialization
  distances.set(source, 0);
  costs.set(source, 0);
  pq.push({ node: source, distance: 0 });

  while (pq.length > 0) {
    // Extract minimum distance node
    pq.sort((a, b) => a.distance - b.distance);
    const current = pq.shift()!;

    if (visited.has(current.node)) continue;
    visited.add(current.node);

    const edges = graph.get(current.node);
    if (!edges) continue;

    // Relaxation step
    for (const edge of edges) {
      if (visited.has(edge.to)) continue;

      const newDistance = distances.get(current.node)! + edge.distance;
      const newCost = costs.get(current.node)! + edge.travelCost;

      if (newDistance < distances.get(edge.to)!) {
        distances.set(edge.to, newDistance);
        costs.set(edge.to, newCost);
        previous.set(edge.to, current.node);
        pq.push({ node: edge.to, distance: newDistance });
      }
    }
  }

  return { distances, costs, previous };
}

/**
 * Find shortest path between two specific nodes using Dijkstra.
 * Returns the path as array of node IDs and total distance.
 */
export function shortestPath(
  graph: AdjacencyList,
  from: number,
  to: number
): { path: number[]; distance: number; cost: number } {
  const result = dijkstra(graph, from);
  const path: number[] = [];

  let current: number | null | undefined = to;
  while (current !== null && current !== undefined) {
    path.unshift(current);
    current = result.previous.get(current) ?? null;
  }

  // If path doesn't start from source, no path exists
  if (path[0] !== from) {
    return { path: [], distance: Infinity, cost: Infinity };
  }

  return {
    path,
    distance: result.distances.get(to) ?? Infinity,
    cost: result.costs.get(to) ?? Infinity,
  };
}

/**
 * Compute all-pairs shortest distances.
 * Runs Dijkstra from every node.
 */
export function allPairsShortestPaths(
  graph: AdjacencyList
): Map<number, DijkstraResult> {
  const results = new Map<number, DijkstraResult>();

  for (const node of graph.keys()) {
    results.set(node, dijkstra(graph, node));
  }

  return results;
}
