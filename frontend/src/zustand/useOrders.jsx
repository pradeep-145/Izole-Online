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

        fetchOrdersPromise = axios
          .get("/api/orders/get-orders", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          })
          .then((response) => {
            set({
              orders: response.data.order || [],
              isLoading: false,
              ordersLastFetched: Date.now(),
            });
            return { success: true, orders: response.data.order || [] };
          })
          .catch((error) => {
            set({
              error: error.response?.data?.message || "Failed to fetch orders",
              isLoading: false,
            });
            return {
              success: false,
              error: error.response?.data?.message || "Failed to fetch orders",
            };
          })
          .finally(() => {
            fetchOrdersPromise = null;
          });

        return fetchOrdersPromise;
      },

      // Fetch single order details with caching
      fetchOrderDetails: async (orderId, forceRefresh = false) => {
        const { currentOrder } = get();

        // Use current order if it's the one we want
        if (!forceRefresh && currentOrder && currentOrder._id === orderId) {
          return { success: true, order: currentOrder };
        }

        // Debounce multiple requests for same order
        if (fetchOrderDetailsPromise[orderId]) {
          return fetchOrderDetailsPromise[orderId];
        }

        set({ isLoading: true, error: null });

        fetchOrderDetailsPromise[orderId] = axios
          .get(`/api/orders/get/${orderId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            set({
              currentOrder: response.data.order,
              isLoading: false,
              error: null,
            });
            return { success: true, order: response.data.order };
          })
          .catch((error) => {
            set({
              error:
                error.response?.data?.message ||
                "Failed to fetch order details",
              isLoading: false,
            });
            return {
              success: false,
              error:
                error.response?.data?.message ||
                "Failed to fetch order details",
            };
          })
          .finally(() => {
            delete fetchOrderDetailsPromise[orderId];
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
            `/api/orders/cancel-order/${orderId}`,
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
                ? {
                    ...order,
                    status: "CANCELLED",
                    cancelReason: reason,
                    cancelledAt: new Date(),
                  }
                : order
            ),
            currentOrder:
              state.currentOrder && state.currentOrder._id === orderId
                ? {
                    ...state.currentOrder,
                    status: "CANCELLED",
                    cancelReason: reason,
                    cancelledAt: new Date(),
                  }
                : state.currentOrder,
            isLoading: false,
          }));

          return { success: true, order: response.data.order };
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
          error: null,
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
      // partialize selects which parts of the state to persist in storage
      partialize: (state) => ({
        orders: state.orders,
        ordersLastFetched: state.ordersLastFetched,
      }),
    }
  )
);
