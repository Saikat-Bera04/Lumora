import type { AdjacencyList, DijkstraResult } from "@/types";

/* ────────────────────────────────────────────────
   Binary Min-Heap Priority Queue
   ──────────────────────────────────────────────── */

interface HeapNode {
  node: number;
  distance: number;
}

class MinHeap {
  private heap: HeapNode[] = [];

  get size(): number {
    return this.heap.length;
  }

  push(item: HeapNode): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): HeapNode | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  private bubbleUp(idx: number): void {
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (this.heap[parent].distance <= this.heap[idx].distance) break;
      [this.heap[parent], this.heap[idx]] = [this.heap[idx], this.heap[parent]];
      idx = parent;
    }
  }

  private sinkDown(idx: number): void {
    const length = this.heap.length;
    while (true) {
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      let smallest = idx;

      if (left < length && this.heap[left].distance < this.heap[smallest].distance) {
        smallest = left;
      }
      if (right < length && this.heap[right].distance < this.heap[smallest].distance) {
        smallest = right;
      }
      if (smallest === idx) break;
      [this.heap[smallest], this.heap[idx]] = [this.heap[idx], this.heap[smallest]];
      idx = smallest;
    }
  }
}

/* ────────────────────────────────────────────────
   Dijkstra's Shortest Path Algorithm
   ──────────────────────────────────────────────── */

/**
 * Dijkstra's Shortest Path Algorithm
 *
 * Finds shortest distances and lowest travel costs from a source node
 * to all reachable nodes in a weighted graph.
 *
 * Time Complexity: O((V + E) log V) using a binary min-heap.
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

  // Binary min-heap priority queue — O(log n) insert & extract-min
  const pq = new MinHeap();

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

  while (pq.size > 0) {
    // Extract minimum distance node — O(log V)
    const current = pq.pop()!;

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
        pq.push({ node: edge.to, distance: newDistance }); // O(log V)
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
