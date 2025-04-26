import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Configuration values
const ORDERS_CACHE_TTL = 10 * 60 * 1000; // 10 minutes
let fetchOrdersPromise = null;
let fetchOrderDetailsPromise = {};

export const useOrders = create(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,
      ordersLastFetched: null,

      // Fetch user orders with optimization
      fetchOrders: async (forceRefresh = false) => {
        const { orders, ordersLastFetched, isLoading } = get();
        const now = Date.now();

        // Use cached data if available and fresh
        if (
          isLoading ||
          (!forceRefresh &&
            orders.length > 0 &&
            ordersLastFetched &&
            now - ordersLastFetched < ORDERS_CACHE_TTL)
        ) {
          return { success: true, orders };
        }

        // Debounce multiple simultaneous requests
        if (fetchOrdersPromise) {
          return fetchOrdersPromise;
        }

        set({ isLoading: true, error: null });

        fetchOrdersPromise = new Promise(async (resolve) => {
          try {
            const response = await axios.get("/api/orders", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });

            set({
              orders: response.data.orders || [],
              isLoading: false,
              ordersLastFetched: Date.now(),
            });

            resolve({ success: true, orders: response.data.orders });
          } catch (error) {
            set({
              error: error.response?.data?.message || "Failed to fetch orders",
              isLoading: false,
            });
            resolve({
              success: false,
              error: error.response?.data?.message || "Failed to fetch orders",
            });
          } finally {
            fetchOrdersPromise = null;
          }
        });

        return fetchOrdersPromise;
      },

      // Fetch single order details with caching
      fetchOrderDetails: async (orderId, forceRefresh = false) => {
        const { currentOrder, isLoading } = get();

        // Use current order if it's the one we want
        if (!forceRefresh && currentOrder && currentOrder._id === orderId) {
          return { success: true, order: currentOrder };
        }

        // Debounce multiple requests for same order
        if (fetchOrderDetailsPromise[orderId]) {
          return fetchOrderDetailsPromise[orderId];
        }

        set({ isLoading: true, error: null });

        fetchOrderDetailsPromise[orderId] = new Promise(async (resolve) => {
          try {
            const response = await axios.get(`/api/orders/${orderId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });

            set({
              currentOrder: response.data.order,
              isLoading: false,
            });

            resolve({ success: true, order: response.data.order });
          } catch (error) {
            set({
              error:
                error.response?.data?.message ||
                "Failed to fetch order details",
              isLoading: false,
            });
            resolve({
              success: false,
              error:
                error.response?.data?.message ||
                "Failed to fetch order details",
            });
          } finally {
            delete fetchOrderDetailsPromise[orderId];
          }
        });

        return fetchOrderDetailsPromise[orderId];
      },

      // Place order
      placeOrder: async (orderData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post("/api/orders", orderData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });

          // Update orders list with new order
          set((state) => ({
            orders: [response.data.order, ...state.orders],
            currentOrder: response.data.order,
            isLoading: false,
          }));

          return { success: true, order: response.data.order };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to place order",
            isLoading: false,
          });
          return {
            success: false,
            error: error.response?.data?.message || "Failed to place order",
          };
        }
      },

      // Cancel order
      cancelOrder: async (orderId, reason) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `/api/orders/${orderId}/cancel`,
            { reason },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          // Update order status in both orders list and current order
          set((state) => ({
            orders: state.orders.map((order) =>
              order._id === orderId
                ? { ...order, status: "Cancelled", cancelReason: reason }
                : order
            ),
            currentOrder:
              state.currentOrder && state.currentOrder._id === orderId
                ? {
                    ...state.currentOrder,
                    status: "Cancelled",
                    cancelReason: reason,
                  }
                : state.currentOrder,
            isLoading: false,
          }));

          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || "Failed to cancel order",
            isLoading: false,
          });
          return {
            success: false,
            error: error.response?.data?.message || "Failed to cancel order",
          };
        }
      },

      // Clear order data (e.g., on logout)
      clearOrderData: () => {
        set({
          orders: [],
          currentOrder: null,
          ordersLastFetched: null,
        });
      },

      // Check if data is stale
      isDataStale: () => {
        const { ordersLastFetched } = get();
        const now = Date.now();
        return !ordersLastFetched || now - ordersLastFetched > ORDERS_CACHE_TTL;
      },
    }),
    {
      name: "orders-storage",
      partialize: (state) => ({
        orders: state.orders,
        ordersLastFetched: state.ordersLastFetched,
      }),
    }
  )
);
