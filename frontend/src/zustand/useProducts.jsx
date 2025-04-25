import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProduct = create(
  persist(
    (set, get) => ({
      products: [],
      isInitialized: false,
      setProducts: (products) => set({ products }),
      fetchProductsIfEmpty: async () => {
        // Get the persisted state
        console.log("Product getting...");
        const state = get();
        if (state.isInitialized && state.products.length > 0) {
          return; // Exit if we already have data
        }

        try {
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
          });
          console.log(data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      },
      // Add a method to clear the store if needed
      clearStore: () => {
        set({ products: [], isInitialized: false });
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
