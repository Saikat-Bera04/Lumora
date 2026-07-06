import type { Attraction, RouteEdge, Dataset } from "@/types";

/**
 * Parse a TXT dataset file into structured Attraction and Route data.
 * Expected format:
 *   # Attractions
 *   ID,Name,Category,EntryFee,VisitTime(hours),Rating
 *   1,Victoria Memorial,Museum,50,2,5
 *   ...
 *   # Distances
 *   From,To,Distance(km),TravelCost
 *   1,2,6,40
 *   ...
 */
export function parseDataset(
  content: string,
  filename: string,
  fileSize: number
): Dataset {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const attractions: Attraction[] = [];
  const routes: RouteEdge[] = [];

  let section: "none" | "attractions" | "distances" = "none";
  let headerSkipped = false;

  for (const line of lines) {
    // Section headers
    if (line.toLowerCase().startsWith("# attractions")) {
      section = "attractions";
      headerSkipped = false;
      continue;
    }
    if (line.toLowerCase().startsWith("# distances")) {
      section = "distances";
      headerSkipped = false;
      continue;
    }

    // Skip column header row
    if (!headerSkipped && section !== "none") {
      if (
        line.toLowerCase().includes("id,") ||
        line.toLowerCase().includes("from,")
      ) {
        headerSkipped = true;
        continue;
      }
      headerSkipped = true;
    }

    // Skip comments / non-data lines
    if (line.startsWith("#") || line.startsWith("//")) continue;

    const parts = line.split(",").map((p) => p.trim());

    if (section === "attractions" && parts.length >= 6) {
      attractions.push({
        id: parseInt(parts[0], 10),
        name: parts[1],
        category: parts[2],
        entryFee: parseFloat(parts[3]),
        visitTime: parseFloat(parts[4]),
        rating: parseFloat(parts[5]),
      });
    } else if (section === "distances" && parts.length >= 4) {
      routes.push({
        from: parseInt(parts[0], 10),
        to: parseInt(parts[1], 10),
        distance: parseFloat(parts[2]),
        travelCost: parseFloat(parts[3]),
      });
    }
  }

  if (attractions.length === 0) {
    throw new Error("No attractions found in dataset. Check the file format.");
  }

  return { attractions, routes, filename, fileSize };
}

/**
 * Validate the parsed dataset for consistency.
 */
export function validateDataset(dataset: Dataset): string[] {
  const errors: string[] = [];
  const ids = new Set(dataset.attractions.map((a) => a.id));

  // Check unique IDs
  if (ids.size !== dataset.attractions.length) {
    errors.push("Duplicate attraction IDs found.");
  }

  // Check route references
  for (const route of dataset.routes) {
    if (!ids.has(route.from)) {
      errors.push(`Route references unknown attraction ID ${route.from}`);
    }
    if (!ids.has(route.to)) {
      errors.push(`Route references unknown attraction ID ${route.to}`);
    }
  }

  // Check for negative values
  for (const a of dataset.attractions) {
    if (a.entryFee < 0) errors.push(`${a.name} has negative entry fee.`);
    if (a.visitTime <= 0) errors.push(`${a.name} has invalid visit time.`);
    if (a.rating < 0 || a.rating > 5) errors.push(`${a.name} has invalid rating.`);
  }

  return errors;
}
