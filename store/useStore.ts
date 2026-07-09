import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Dataset, Preferences, OptimizationResult, TripSummary } from "@/types";

interface AppState {
  // Dataset
  dataset: Dataset | null;
  setDataset: (dataset: Dataset | null) => void;

  // Preferences
  preferences: Preferences;
  setPreferences: (preferences: Preferences) => void;

  // Optimization
  optimizationResult: OptimizationResult | null;
  setOptimizationResult: (result: OptimizationResult | null) => void;

  // Trip Summary
  tripSummary: TripSummary | null;
  setTripSummary: (summary: TripSummary | null) => void;

  // UI State
  isOptimizing: boolean;
  setIsOptimizing: (val: boolean) => void;

  // Session info (from landing page)
  userEmail: string;
  setUserEmail: (email: string) => void;

  // Reset
  reset: () => void;
}

const defaultPreferences: Preferences = {
  budget: 1000,
  maxTime: 8,
  startLocation: 1,
  preferredCategories: [],
  transportMode: "auto",
  maxAttractions: 5,
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      dataset: null,
      setDataset: (dataset) => set({ dataset }),

      preferences: defaultPreferences,
      setPreferences: (preferences) => set({ preferences }),

      optimizationResult: null,
      setOptimizationResult: (optimizationResult) => set({ optimizationResult }),

      tripSummary: null,
      setTripSummary: (tripSummary) => set({ tripSummary }),

      isOptimizing: false,
      setIsOptimizing: (isOptimizing) => set({ isOptimizing }),

      userEmail: "",
      setUserEmail: (userEmail) => set({ userEmail }),

      reset: () =>
        set({
          dataset: null,
          preferences: defaultPreferences,
          optimizationResult: null,
          tripSummary: null,
          isOptimizing: false,
          userEmail: "",
        }),
    }),
    {
      name: "Lumora-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        dataset: state.dataset,
        preferences: state.preferences,
        optimizationResult: state.optimizationResult,
        tripSummary: state.tripSummary,
        userEmail: state.userEmail,
      }),
    }
  )
);
