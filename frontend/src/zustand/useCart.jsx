import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Configuration values
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds
let fetchPromise = null; // For request debouncing

export const useCart = create(
  persist(
    (set, get) => ({
      cartItems: [],
      isLoading: false,
      error: null,
      cartFetched: false, // Track if cart has been fetched from backend
      lastFetchTime: null, // Track when data was last fetched

      addToCart: async (item) => {
        set({ isLoading: true, error: null });
        try {
          const { cartItems } = get();
          const existingItemIndex = cartItems.findIndex(
            (cartItem) =>
              cartItem.product._id === item.product._id &&
              cartItem.color === item.color &&
              cartItem.size === item.size
          );

          if (existingItemIndex !== -1) {
            // If item exists, update quantity via API
            const updatedQuantity =
              cartItems[existingItemIndex].quantity + item.quantity;

            if (
              updatedQuantity > cartItems[existingItemIndex].product.quantity
            ) {
              set({
                error: "Not enough stock available",
                isLoading: false,
              });
              return { success: false, error: "Not enough stock available" };
            }

            await axios.put(
              "/api/cart/update",
              {
                productId: item.product._id,
                color: item.color,
                size: item.size,
                quantity: updatedQuantity,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const updatedItems = [...cartItems];
            updatedItems[existingItemIndex].quantity = updatedQuantity;
            set({ cartItems: updatedItems, isLoading: false });
          } else {
            // If item is new, add it via API
            const response = await axios.post("/api/cart/add", item, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });
            set({
              cartItems: [...cartItems, response.data.item || item],
              isLoading: false,
            });
          }
          return { success: true };
        } catch (error) {
          set({
            error:
              error.response?.data?.message || "Failed to add item to cart",
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Remove from cart with API integration
      removeFromCart: async (itemId, color, size) => {
        set({ isLoading: true, error: null });
        try {
          // First remove from backend
          await axios.delete("/api/cart/remove", {
            data: { productId: itemId, color, size },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          // Then update local state
          const { cartItems } = get();
          set({
            cartItems: cartItems.filter(
              (item) =>
                !(
                  item.product._id === itemId &&
                  item.color === color &&
                  item.size === size
                )
            ),
            isLoading: false,
          });
          return { success: true };
        } catch (error) {
          set({
            error:
              error.response?.data?.message ||
              "Failed to remove item from cart",
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Update quantity with API integration
      updateQuantity: async (itemId, color, size, newQuantity) => {
        set({ isLoading: true, error: null });
        try {
          // First update on backend
          console.log(localStorage.getItem("token"));
          await axios.put(
            "/api/cart/update",
            {
              productId: itemId,
              color,
              size,
              quantity: newQuantity,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          // Then update local state
          const { cartItems } = get();
          const updatedItems = cartItems.map((item) => {
            if (
              item.product._id === itemId &&
              item.color === color &&
              item.size === size
            ) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
          set({ cartItems: updatedItems, isLoading: false });
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to update cart",
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Fetch cart from backend
      fetchCart: async (forceRefresh = false) => {
        const { cartItems, cartFetched, lastFetchTime, isLoading } = get();
        const now = Date.now();

        // Skip the request if:
        // 1. We're already loading data
        // 2. We have data and it's not a forced refresh
        // 3. Data is not expired (within TTL)
        if (
          isLoading ||
          (!forceRefresh &&
            cartFetched &&
            cartItems.length > 0 &&
            lastFetchTime &&
            now - lastFetchTime < CACHE_TTL)
        ) {
          return { success: true, items: cartItems };
        }

        // Debounce multiple simultaneous requests
        if (fetchPromise) {
          return fetchPromise;
        }

        set({ isLoading: true, error: null });

        fetchPromise = new Promise(async (resolve) => {
          try {
            console.log("Fetching cart from backend...");
            const response = await axios.get("/api/cart/get", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });

            set({
              cartItems: response.data.items || [],
              isLoading: false,
              cartFetched: true,
              lastFetchTime: Date.now(),
            });

            resolve({ success: true, items: response.data.items });
          } catch (error) {
            set({
              error: error.response?.data?.message || "Failed to fetch cart",
              isLoading: false,
            });
            resolve({ success: false, error: error.response?.data?.message });
          } finally {
            fetchPromise = null;
          }
        });

        return fetchPromise;
      },

      // Clear cart with API integration
      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete("/api/cart/clear", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });
          set({
            cartItems: [],
            isLoading: false,
            cartFetched: false,
            lastFetchTime: null,
          });
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to clear cart",
            isLoading: false,
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Force refresh cart from backend
      refreshCart: async () => {
        return get().fetchCart(true);
      },

      getCartTotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
      },

      cartLogout: async () => {
        console.log("cart logging out");
        set({
          cartItems: [],
          cartFetched: false,
          lastFetchTime: null,
        });
      },

      // Check if data needs refreshing
      isDataStale: () => {
        const { lastFetchTime, cartItems } = get();
        const now = Date.now();
        return (
          !lastFetchTime || now - lastFetchTime > CACHE_TTL || !cartItems.length
        );
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartFetched: state.cartFetched,
        lastFetchTime: state.lastFetchTime,
      }),
    }
  )
);
