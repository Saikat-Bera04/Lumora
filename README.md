# Lumora Planner

> Plan Smarter. Travel Better.

Lumora Planner is a production-ready, premium-quality web application built to help tourists generate the most optimal itinerary based on multiple parameters, including Budget, Available Time, Attraction Preferences, Distance Between Attractions, and Travel Cost. 

This project combines advanced algorithmic optimization (Dijkstra, Knapsack, and Traveling Salesperson Problem) with a highly cinematic, Apple-level user interface using Next.js 15, React, Tailwind CSS, Framer Motion, and Lucide React.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [UI & UX Design System](#ui--ux-design-system)
4. [File & Directory Structure](#file--directory-structure)
5. [Backend Architecture & Algorithms (DAA)](#backend-architecture--algorithms-daa)
6. [Dataset Format](#dataset-format)
7. [Installation & Setup](#installation--setup)
8. [Usage & Flow](#usage--flow)

---

## Features

- **Dataset Upload**: Drag-and-drop or browse to upload TXT datasets containing attraction and route data. Validates the data and provides upload status and dataset statistics.
- **Preferences Engine**: Highly customizable preferences including Budget, Maximum Time, Starting Location, Preferred Categories, Transportation Mode, and Maximum Attractions.
- **Cinematic Dataset Preview**: Glassmorphism cards and tables to view parsed attractions and distance matrices with search, sorting, filtering, and pagination.
- **Live Optimization Pipeline**: An animated visual representation of the algorithmic pipeline (Parsing → Graph Creation → Dijkstra → Knapsack → TSP → Route Optimization).
- **Optimized Dashboard**: A comprehensive hero summary with animated cards displaying Total Distance, Travel Cost, Entry Fees, Budget Used, Time, Ratings, and an Interactive Timeline.
- **Interactive Route Mapping**: Fullscreen Leaflet Map displaying the animated path, location markers, and floating glass legends.
- **Analytics Module**: Recharts-powered dashboard for Budget Distribution, Travel Time, Category Distribution, Distance Analysis, and Ratings.
- **Trip Summary & Export**: Professional report generation with options to Download PDF, Print, Share, or Restart Planning.

---

## Tech Stack

### Framework
- **Next.js 15 (App Router)**
- **React**
- **TypeScript**

### Styling & Animation
- **Tailwind CSS**: Core utility-first CSS framework.
- **Framer Motion**: Cinematic and fluid page transitions, component entrances, and micro-interactions.
- **clsx** & **tailwind-merge**: Conditional and dynamic class merging utilities.

### State & Forms
- **Zustand**: Lightweight global state management for preferences and itinerary data.
- **React Hook Form**: Performant, flexible, and extensible forms with easy-to-use validation.
- **Zod**: TypeScript-first schema declaration and validation.

### UI Components & Utilities
- **Lucide React**: Clean, consistent icon set.
- **React Leaflet** / **OpenStreetMap**: Interactive mapping capabilities.
- **Recharts**: Composable charting library.
- **React Hot Toast**: Beautiful notifications.
- **react-dropzone**: Simple React hook to create a HTML5-compliant drag'n'drop zone for files.

---

## UI & UX Design System

The application strictly adheres to a cinematic, premium visual language previously defined in the Landing Page specification.

### Visual Elements
- **Glassmorphism (`.liquid-glass`)**: Extensive use of blurred backgrounds, semi-transparent overlays, and delicate borders.
- **Typography**: 
  - **Headings**: `Instrument Serif` (Google Fonts) for a sophisticated, editorial feel.
  - **Body**: `system-ui` for maximum readability and a clean modern aesthetic.
- **Colors**:
  - Primary: `White`
  - Secondary: `rgba(255,255,255,0.75)`
  - Glass: `rgba(255,255,255,0.05)`
  - Dark Text: `#182C41`
  - Background: Black with dynamic cinematic background videos layer.
  - Buttons: Solid white.
- **Animations**: Soft floating effects, scroll-driven entrances, hover state micro-interactions, crossfades, and staggered text reveals using `cubic-bezier(0.4,0,0.2,1)`.

---

## File & Directory Structure

The project follows a scalable, modular structure tailored for the Next.js 15 App Router paradigm.

```text
/Applications/Development/daa-project/
├── app/                  # Next.js 15 App Router directory
│   ├── api/              # Backend API Routes
│   │   ├── upload/route.ts
│   │   ├── optimize/route.ts
│   │   └── ...
│   ├── page.tsx          # Cinematic Landing Page
│   ├── layout.tsx        # Root layout, fonts, and global context
│   ├── globals.css       # Tailwind directives and .liquid-glass definitions
│   └── ...               # Additional application routes (preview, processing, summary)
├── components/           # Reusable UI components
│   ├── ui/               # Base components (Buttons, Inputs, Cards)
│   ├── layout/           # Navbar, Footer, Background Videos
│   └── forms/            # Form elements and upload zones
├── lib/                  # Core Business Logic & DAA Algorithms
│   ├── parser.ts         # TXT parsing and dataset validation
│   ├── graph.ts          # Graph data structure (Adjacency List)
│   ├── dijkstra.ts       # Shortest path algorithm implementation
│   ├── knapsack.ts       # 0/1 Knapsack optimization logic
│   ├── tsp.ts            # Traveling Salesperson Problem heuristic
│   ├── optimizer.ts      # Pipeline orchestrator
│   └── helpers.ts        # General utility functions
├── types/                # Global TypeScript Definitions
│   └── index.ts          # Interfaces for Attraction, RouteEdge, Dataset, Preferences, etc.
├── store/                # Zustand State Management
│   └── useStore.ts       # Global store for user preferences and itinerary state
├── public/               # Static assets (images, icons)
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

---

## Backend Architecture & Algorithms (DAA)

The backend functionality is encapsulated within the `lib/` directory and exposed via Next.js API Routes in `app/api/`. The core logic revolves around Design and Analysis of Algorithms (DAA) concepts to provide the most optimal travel itinerary.

### `lib/parser.ts`
- **Purpose**: Reads the uploaded TXT dataset, validates the structure, checks for negative values and duplicate IDs, and converts the raw text into structured JSON arrays (`Attraction[]` and `RouteEdge[]`).
- **Validation**: Ensures every route reference maps to an existing attraction ID.

### `lib/graph.ts`
- **Purpose**: Constructs a weighted graph using an Adjacency List representation (`Map<number, GraphEdge[]>`). Supports both directed and undirected edge creation based on the parsed routes.

### `lib/dijkstra.ts`
- **Purpose**: Implements Dijkstra's Algorithm to find the shortest paths (or lowest costs) from the user's selected starting location to all other attractions in the graph.
- **Complexity**: $O((V+E) \log V)$

### `lib/knapsack.ts`
- **Purpose**: Implements a variation of the 0/1 Knapsack problem. It selects the optimal combination of attractions that maximizes the overall `rating` (or heuristic score) while ensuring the cumulative entry fees do not exceed the `Budget` and the cumulative visit times do not exceed the `Maximum Time`.
- **Logic**: Utilizes estimated travel times/costs from the Dijkstra step to penalize distant attractions and applies a heuristic multiplier for user-preferred categories.

### `lib/tsp.ts`
- **Purpose**: Implements a Nearest Neighbor heuristic for the Traveling Salesperson Problem (TSP). Once the knapsack algorithm selects the attractions, this algorithm determines the most efficient order to visit them, minimizing total travel distance.
- **Complexity**: $O(N^2)$

### `lib/optimizer.ts`
- **Purpose**: The main pipeline orchestrator. It chains the algorithms sequentially:
  1. Build Graph
  2. Run Dijkstra
  3. Run Knapsack Selection
  4. Run TSP Ordering
  5. Generate Final Itinerary Breakdown (calculating cumulative times, distances, and costs).

---

## Dataset Format

The application accepts a `.txt` dataset file structured specifically into two sections: `# Attractions` and `# Distances`.

**Example:**
```txt
# Attractions
ID,Name,Category,EntryFee,VisitTime(hours),Rating
1,Victoria Memorial,Museum,50,2,5
2,Science City,Science,80,3,4
3,Eco Park,Park,30,4,5
4,Dakshineswar,Temple,20,2,5

# Distances
From,To,Distance(km),TravelCost
1,2,6,40
1,3,12,80
2,3,5,30
2,4,10,70
3,4,8,50
1,4,15,100
```

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd daa-project
   ```

2. **Install dependencies:**
   Using npm:
   ```bash
   npm install
   ```
   Or using yarn/pnpm:
   ```bash
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## Usage & Flow

1. **Landing Page**: Experience the cinematic hero section and click "Get Started".
2. **Dataset Upload**: Drag and drop your `.txt` dataset into the designated dropzone.
3. **Set Preferences**: Adjust your available budget, maximum time, start location, and preferred attraction categories using the animated UI controls.
4. **Optimization Pipeline**: Watch the system run Graph Construction, Dijkstra, Knapsack, and TSP algorithms visually.
5. **Review Itinerary**: View the generated Optimized Dashboard, Interactive Route on the map, and analytical charts.
6. **Export**: Export the final trip summary as a PDF.
