import type { Attraction } from "@/types";

/**
 * 0/1 Knapsack — Dynamic Programming
 *
 * Selects the optimal subset of attractions that maximizes
 * total rating while staying within budget and time constraints.
 *
 * This is a 2D knapsack (dual constraints: budget & time).
 * We discretize budget into integer units and time into 30-min slots.
 *
 * Time Complexity: O(n × B × T) where n = attractions, B = budget units, T = time slots
 * Space Complexity: O(n × B × T)
 *
 * @param attractions - Available attractions to select from
 * @param budget - Maximum total budget (entry fees)
 * @param maxTime - Maximum total visit time (hours)
 * @param maxAttractions - Maximum number of attractions to select
 * @returns Selected attractions sorted by rating (descending)
 */
export function knapsack(
  attractions: Attraction[],
  budget: number,
  maxTime: number,
  maxAttractions: number
): Attraction[] {
  const n = attractions.length;

  if (n === 0) return [];

  // Discretize: budget in ₹1 units, time in 0.5-hour slots
  const B = Math.floor(budget);
  const T = Math.floor(maxTime * 2); // 30-min slots

  // Clamp to prevent memory explosion with large budgets
  const maxB = Math.min(B, 10000);
  const maxT = Math.min(T, 48); // max 24 hours

  // dp[i][b][t] = max rating using first i items with budget b and time t
  // Optimized to 2D (rolling over items)
  // dp[b][t] = max rating
  const dp: number[][] = Array.from({ length: maxB + 1 }, () =>
    new Array(maxT + 1).fill(0)
  );

  // Track which items were selected
  const selected: boolean[][] = Array.from({ length: n }, () =>
    Array.from({ length: maxB + 1 }, () => false)
  );

  // Use a separate structure to reconstruct
  const dpPrev: number[][][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: maxB + 1 }, () => new Array(maxT + 1).fill(0))
  );

  for (let i = 1; i <= n; i++) {
    const item = attractions[i - 1];
    const fee = Math.floor(item.entryFee);
    const time = Math.floor((item.visitTime + 0.5) * 2); // in 30-min slots + 30 mins avg travel time

    for (let b = 0; b <= maxB; b++) {
      for (let t = 0; t <= maxT; t++) {
        // Don't take item i
        dpPrev[i][b][t] = dpPrev[i - 1][b][t];

        // Take item i (if we can afford it)
        if (b >= fee && t >= time) {
          const withItem = dpPrev[i - 1][b - fee][t - time] + item.rating;
          if (withItem > dpPrev[i][b][t]) {
            dpPrev[i][b][t] = withItem;
          }
        }
      }
    }
  }

  // Backtrack to find which items were selected
  const result: Attraction[] = [];
  let remB = maxB;
  let remT = maxT;

  for (let i = n; i >= 1; i--) {
    if (dpPrev[i][remB][remT] !== dpPrev[i - 1][remB][remT]) {
      const item = attractions[i - 1];
      result.push(item);
      remB -= Math.floor(item.entryFee);
      remT -= Math.floor((item.visitTime + 0.5) * 2);
    }
  }

  // Enforce maxAttractions limit — keep highest rated
  result.sort((a, b) => b.rating - a.rating);

  return result.slice(0, maxAttractions);
}

/**
 * Greedy fallback for very large datasets where DP would be too slow.
 * Uses rating-per-cost heuristic.
 */
export function greedyKnapsack(
  attractions: Attraction[],
  budget: number,
  maxTime: number,
  maxAttractions: number
): Attraction[] {
  // Sort by value density (rating / (entryFee + visitTime_cost))
  const sorted = [...attractions].sort((a, b) => {
    const densityA = a.rating / (a.entryFee + a.visitTime + 0.5);
    const densityB = b.rating / (b.entryFee + b.visitTime + 0.5);
    return densityB - densityA;
  });

  const result: Attraction[] = [];
  let usedBudget = 0;
  let usedTime = 0;

  for (const attraction of sorted) {
    if (result.length >= maxAttractions) break;
    if (usedBudget + attraction.entryFee <= budget &&
        usedTime + attraction.visitTime + 0.5 <= maxTime) {
      result.push(attraction);
      usedBudget += attraction.entryFee;
      usedTime += attraction.visitTime + 0.5;
    }
  }

  return result;
}
