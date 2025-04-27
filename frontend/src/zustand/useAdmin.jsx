import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Configuration values
const DASHBOARD_DATA_TTL = 5 * 60 * 1000; // Dashboard data fresh for 5 minutes
const PRODUCT_DATA_TTL = 10 * 60 * 1000; // Product data fresh for 10 minutes
const ORDER_DATA_TTL = 5 * 60 * 1000; // Order data fresh for 5 minutes
const USER_DATA_TTL = 30 * 60 * 1000; // User data fresh for 30 minutes

// Request debouncing
const pendingRequests = {
  products: null,
  orders: null,
  users: null,
  analytics: null,
};

export const useAdmin = create(
  persist(
    (set, get) => ({
      // Authentication & Admin State
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastAuthTime: null,

      // Products State
      products: [],
      productCount: 0,
      selectedProduct: null,
      productsLastFetched: null,

      // Orders State
      orders: [],
      orderCount: 0,
      pendingOrders: 0,
      ordersLastFetched: null,

      // Users/Customers State
      users: [],
      userCount: 0,
      usersLastFetched: null,

      // Dashboard Analytics
      analytics: {
        revenue: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
        sales: { daily: 0, weekly: 0, monthly: 0 },
        topProducts: [],
        lowStockProducts: [],
      },
      analyticsLastFetched: null,

      // Authentication Methods
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/admin/login`,
            {
              email,
              password,
            }
          );

          if (response.data.success) {
            set({
              admin: response.data.admin,
              isAuthenticated: true,
              isLoading: false,
              lastAuthTime: Date.now(),
            });

            // Store admin token if provided
            if (response.data.token) {
              localStorage.setItem("adminToken", response.data.token);
            }

            return { success: true };
          } else {
            set({
              error: response.data.message || "Login failed",
              isLoading: false,
            });
            return { success: false, message: response.data.message };
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || "Authentication failed",
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || "Authentication failed",
          };
        }
      },

      logout: () => {
        localStorage.removeItem("adminToken");
        set({
          admin: null,
          isAuthenticated: false,
          lastAuthTime: null,
          // Reset all cached data
          analytics: {
            revenue: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
            sales: { daily: 0, weekly: 0, monthly: 0 },
            topProducts: [],
            lowStockProducts: [],
          },
          analyticsLastFetched: null,
        });
      },

      // Product Management Methods with optimization
      fetchProducts: async (
        page = 1,
        limit = 10,
        filters = {},
        forceRefresh = false
      ) => {
        const { products, productsLastFetched, isLoading } = get();
        const now = Date.now();

        // Skip if:
        // 1. Already loading
        // 2. Not forcing refresh and we have recent data
        if (
          isLoading ||
          (!forceRefresh &&
            products.length > 0 &&
            productsLastFetched &&
            now - productsLastFetched < PRODUCT_DATA_TTL &&
            page === 1 && // Only skip if requesting first page (default)
            Object.keys(filters).length === 0) // And no filters applied
        ) {
          return { success: true, products, totalCount: get().productCount };
        }

        // Debounce similar requests
        const requestKey = `${page}-${limit}-${JSON.stringify(filters)}`;
        if (pendingRequests.products?.[requestKey]) {
          return pendingRequests.products[requestKey];
        }

        set({ isLoading: true });

        if (!pendingRequests.products) pendingRequests.products = {};
        pendingRequests.products[requestKey] = new Promise(async (resolve) => {
          try {
            let queryParams = new URLSearchParams({
              page,
              limit,
              ...filters,
            }).toString();

            const response = await axios.get(
              `${import.meta.env.VITE_SERVER_URL}/api/products?${queryParams}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
              }
            );

            set({
              products: response.data.products || [],
              productCount: response.data.totalCount || 0,
              productsLastFetched: Date.now(),
              isLoading: false,
            });

            resolve(response.data);
          } catch (error) {
            set({
              error: error.message,
              isLoading: false,
            });
            resolve({ success: false, message: error.message });
          } finally {
            delete pendingRequests.products[requestKey];
          }
        });

        return pendingRequests.products[requestKey];
      },

      // Order Management Methods with optimization
      fetchOrders: async (
        page = 1,
        limit = 10,
        filters = {},
        forceRefresh = false
      ) => {
        const { orders, ordersLastFetched, isLoading } = get();
        const now = Date.now();

        // Skip if cached data is recent and valid
        if (
          isLoading ||
          (!forceRefresh &&
            orders.length > 0 &&
            ordersLastFetched &&
            now - ordersLastFetched < ORDER_DATA_TTL &&
            page === 1 &&
            Object.keys(filters).length === 0)
        ) {
          return { success: true, orders, totalCount: get().orderCount };
        }

        // Implement rest of the method similar to fetchProducts
        set({ isLoading: true });
        // ...existing implementation...

        // Don't forget to set ordersLastFetched on success
        set({ ordersLastFetched: Date.now() });
        // ...existing code...
      },

      // Dashboard Analytics with optimization
      fetchDashboardAnalytics: async (forceRefresh = false) => {
        const { analytics, analyticsLastFetched, isLoading } = get();
        const now = Date.now();

        // Skip if data is fresh
        if (
          isLoading ||
          (!forceRefresh &&
            analyticsLastFetched &&
            now - analyticsLastFetched < DASHBOARD_DATA_TTL)
        ) {
          return { success: true, data: analytics };
        }

        // Implement debouncing
        if (pendingRequests.analytics) {
          return pendingRequests.analytics;
        }

        set({ isLoading: true });

        pendingRequests.analytics = new Promise(async (resolve) => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_SERVER_URL}/api/admin/analytics`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                },
              }
            );

            set({
              analytics: response.data,
              analyticsLastFetched: Date.now(),
              isLoading: false,
            });

            resolve({ success: true, data: response.data });
          } catch (error) {
            set({
              error: error.message,
              isLoading: false,
            });
            resolve({ success: false, message: error.message });
          } finally {
            pendingRequests.analytics = null;
          }
        });

        return pendingRequests.analytics;
      },

      // Helper methods to check data freshness
      isProductDataStale: () => {
        const { productsLastFetched } = get();
        return (
          !productsLastFetched ||
          Date.now() - productsLastFetched > PRODUCT_DATA_TTL
        );
      },

      isOrderDataStale: () => {
        const { ordersLastFetched } = get();
        return (
          !ordersLastFetched || Date.now() - ordersLastFetched > ORDER_DATA_TTL
        );
      },

      isAnalyticsDataStale: () => {
        const { analyticsLastFetched } = get();
        return (
          !analyticsLastFetched ||
          Date.now() - analyticsLastFetched > DASHBOARD_DATA_TTL
        );
      },
    }),
    {
      name: "admin-storage",
      // Only persist authentication state and not all the data
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
        lastAuthTime: state.lastAuthTime,
      }),
    }
  )
);
