import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Configuration values
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds
let fetchPromise = null; // For request debouncing

export const useProduct = create(
  persist(
    (set, get) => ({
      products: [],
      isInitialized: false,
      lastFetchTime: null, // Track when data was last fetched
      isLoading: false,
      error: null,

      setProducts: (products) => set({ products }),

      fetchProductsIfEmpty: async (forceRefresh = false) => {
        // Get the persisted state
        const state = get();
        const now = Date.now();

        // Skip the request if:
        // 1. We're already loading data
        // 2. We have data and it's not a forced refresh
        // 3. Data is not expired (within TTL)
        if (
          state.isLoading ||
          (!forceRefresh &&
            state.isInitialized &&
            state.products.length > 0 &&
            state.lastFetchTime &&
            now - state.lastFetchTime < CACHE_TTL)
        ) {
          return { success: true, products: state.products };
        }

        // Debounce multiple simultaneous requests
        if (fetchPromise) {
          return fetchPromise;
        }

        set({ isLoading: true, error: null });

        fetchPromise = new Promise(async (resolve) => {
          try {
            console.log("Fetching products from backend...");
            const response = await axios.get("/api/products/get-products", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });

            const data = await response.data;
            set({
              products: data.result,
              isInitialized: true,
              lastFetchTime: Date.now(),
              isLoading: false,
              error: null,
            });

            resolve({ success: true, products: data.result });
          } catch (error) {
            console.error("Error fetching products:", error);
            set({
              isLoading: false,
              error:
                error.response?.data?.message || "Failed to fetch products",
            });
            resolve({
              success: false,
              error:
                error.response?.data?.message || "Failed to fetch products",
            });
          } finally {
            fetchPromise = null; // Clear the promise for next request
          }
        });

        return fetchPromise;
      },

      // Force refresh products from backend
      refreshProducts: async () => {
        return get().fetchProductsIfEmpty(true);
      },

      // Add a method to clear the store if needed
      clearStore: () => {
        set({ products: [], isInitialized: false, lastFetchTime: null });
      },

      // Check if data needs refreshing (useful for components to know if they should trigger a refresh)
      isDataStale: () => {
        const state = get();
        const now = Date.now();
        return (
          !state.lastFetchTime ||
          now - state.lastFetchTime > CACHE_TTL ||
          !state.products.length
        );
      },
    }),
    {
      name: "products-storage",
      storage: localStorage,
      // Add version control for cache busting if needed
      version: 1,
    }
  )
);
