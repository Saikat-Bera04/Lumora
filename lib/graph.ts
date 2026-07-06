import type { RouteEdge, AdjacencyList, GraphEdge } from "@/types";

/**
 * Build a weighted undirected adjacency list from route edges.
 * Each edge contains both distance and travel cost.
 */
export function buildGraph(routes: RouteEdge[]): AdjacencyList {
  const graph: AdjacencyList = new Map();

  for (const route of routes) {
    // Add forward edge
    if (!graph.has(route.from)) graph.set(route.from, []);
    graph.get(route.from)!.push({
      to: route.to,
      distance: route.distance,
      travelCost: route.travelCost,
    });

    // Add reverse edge (undirected graph)
    if (!graph.has(route.to)) graph.set(route.to, []);
    graph.get(route.to)!.push({
      to: route.from,
      distance: route.distance,
      travelCost: route.travelCost,
    });
  }

  return graph;
}

/**
 * Get all unique node IDs from the graph.
 */
export function getNodes(graph: AdjacencyList): number[] {
  return Array.from(graph.keys());
}

/**
 * Get direct distance between two nodes, or Infinity if no direct edge.
 */
export function getDirectDistance(
  graph: AdjacencyList,
  from: number,
  to: number
): number {
  const edges = graph.get(from);
  if (!edges) return Infinity;
  const edge = edges.find((e) => e.to === to);
  return edge ? edge.distance : Infinity;
}

/**
 * Get direct travel cost between two nodes, or Infinity if no direct edge.
 */
export function getDirectCost(
  graph: AdjacencyList,
  from: number,
  to: number
): number {
  const edges = graph.get(from);
  if (!edges) return Infinity;
  const edge = edges.find((e) => e.to === to);
  return edge ? edge.travelCost : Infinity;
}

/**
 * Build a distance matrix from the adjacency list.
 * Returns a Map of Maps: matrix[from][to] = distance
 */
export function buildDistanceMatrix(
  graph: AdjacencyList
): Map<number, Map<number, number>> {
  const nodes = getNodes(graph);
  const matrix = new Map<number, Map<number, number>>();

  for (const node of nodes) {
    matrix.set(node, new Map());
    matrix.get(node)!.set(node, 0);
  }

  for (const [from, edges] of graph) {
    for (const edge of edges) {
      matrix.get(from)!.set(edge.to, edge.distance);
    }
  }

  return matrix;
}
