import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Configuration values
const CACHE_TTL = 60 * 60 * 1000; // 60 minutes in milliseconds
let fetchPromise = null; // For request debouncing

export const useWishlist = create(
  persist(
    (set, get) => ({
      wishlistItems: [],
      isLoading: false,
      error: null,
      dataFetched: false, // Initial state should be false
      lastFetchTime: null,

      // Add to wishlist with API integration
      addToWishlist: async (product) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            "/api/wishlist/add",
            { productId: product._id },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          const { wishlistItems } = get();
          const existingItem = wishlistItems.find(
            (item) => item.product._id === product._id
          );

          if (!existingItem) {
            set({
              wishlistItems: [...wishlistItems, { product }],
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
          return { success: true };
        } catch (error) {
          set({
            error:
              error.response?.data?.message || "Failed to add item to wishlist",
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Remove from wishlist with API integration
      removeFromWishlist: async (productId) => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete("/api/wishlist/remove", {
            data: { productId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          const { wishlistItems } = get();
          set({
            wishlistItems: wishlistItems.filter(
              (item) => item.product._id !== productId
            ),
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              "Failed to remove item from wishlist",
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Fetch wishlist with optimization
      fetchWishlist: async (forceRefresh = false) => {
        const { wishlistItems, dataFetched, lastFetchTime, isLoading } = get();
        const now = Date.now();

        console.log("Wishlist fetch requested with state:", {
          forceRefresh,
          dataFetched,
          itemsCount: wishlistItems.length,
          lastFetchTime,
          timeSinceLastFetch: lastFetchTime
            ? now - lastFetchTime
            : "never fetched",
          shouldSkipFetch:
            !forceRefresh &&
            dataFetched &&
            lastFetchTime &&
            now - lastFetchTime < CACHE_TTL,
        });

        // Fix the condition: we should skip fetching even if wishlist is empty
        // because an empty wishlist is a valid state
        if (
          isLoading ||
          (!forceRefresh &&
            dataFetched && // If we've ever fetched before
            lastFetchTime &&
            now - lastFetchTime < CACHE_TTL)
        ) {
          console.log("Using cached wishlist data");
          return { success: true, items: wishlistItems };
        }

        if (fetchPromise) {
          return fetchPromise;
        }

        set({ isLoading: true, error: null });

        fetchPromise = new Promise(async (resolve) => {
          try {
            console.log("Fetching wishlist from backend...");
            const response = await axios.get("/api/wishlist/get", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });

            set({
              wishlistItems: response.data.items || [],
              isLoading: false,
              dataFetched: true,
              lastFetchTime: Date.now(),
            });
            console.log(response.data);

            resolve({ success: true, items: response.data.items });
          } catch (error) {
            set({
              error:
                error.response?.data?.message || "Failed to fetch wishlist",
              isLoading: false,
            });
            resolve({ success: false, error: error.response?.data?.message });
          } finally {
            fetchPromise = null;
          }
        });

        return fetchPromise;
      },

      // Force refresh wishlist
      refreshWishlist: async () => {
        return get().fetchWishlist(true);
      },

      // Clear wishlist with API integration
      clearWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete("/api/wishlist/clear", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          set({
            wishlistItems: [],
            isLoading: false,
            dataFetched: false,
            lastFetchTime: null,
          });
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to clear wishlist",
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Logout wishlist
      wishlistLogout: () => {
        set({
          wishlistItems: [],
          dataFetched: false,
          lastFetchTime: null,
        });
      },

      // Check if item is in wishlist
      isInWishlist: (productId) => {
        const { wishlistItems } = get();
        return wishlistItems.some((item) => item.product._id === productId);
      },

      // Check if data is stale
      isDataStale: () => {
        const { lastFetchTime, wishlistItems } = get();
        const now = Date.now();
        return (
          !lastFetchTime ||
          now - lastFetchTime > CACHE_TTL ||
          !wishlistItems.length
        );
      },

      // Initialize function to mark data as fetched without actual fetching
      // This can be used when we know the wishlist is empty (e.g. for new users)
      initializeEmptyWishlist: () => {
        set({
          dataFetched: true,
          lastFetchTime: Date.now(),
        });
      },
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({
        wishlistItems: state.wishlistItems,
        dataFetched: state.dataFetched,
        lastFetchTime: state.lastFetchTime,
      }),
    }
  )
);
