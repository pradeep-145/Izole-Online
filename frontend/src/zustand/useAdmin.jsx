import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAdmin = create(
  persist(
    (set, get) => ({
      // Authentication & Admin State
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Products State
      products: [],
      productCount: 0,
      selectedProduct: null,

      // Orders State
      orders: [],
      orderCount: 0,
      pendingOrders: 0,

      // Users/Customers State
      users: [],
      userCount: 0,

      // Dashboard Analytics
      analytics: {
        revenue: { daily: 0, weekly: 0, monthly: 0, yearly: 0 },
        sales: { daily: 0, weekly: 0, monthly: 0 },
        topProducts: [],
        lowStockProducts: [],
      },

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
            });
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
        set({
          admin: null,
          isAuthenticated: false,
        });
      },

      // Product Management Methods
      fetchProducts: async (page = 1, limit = 10, filters = {}) => {
        set({ isLoading: true });
        try {
          let queryParams = new URLSearchParams({
            page,
            limit,
            ...filters,
          }).toString();

          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/products?${queryParams}`
          );

          set({
            products: response.data.products || [],
            productCount: response.data.totalCount || 0,
            isLoading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, message: error.message };
        }
      },

      getProductById: async (productId) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`
          );

          set({
            selectedProduct: response.data.product,
            isLoading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, message: error.message };
        }
      },

      createProduct: async (productData) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/products`,
            productData
          );

          // Update products list with new product
          set((state) => ({
            products: [...state.products, response.data.product],
            productCount: state.productCount + 1,
            isLoading: false,
          }));

          return { success: true, product: response.data.product };
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      updateProduct: async (productId, productData) => {
        set({ isLoading: true });
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`,
            productData
          );

          // Update products list with updated product
          set((state) => ({
            products: state.products.map((product) =>
              product._id === productId ? response.data.product : product
            ),
            selectedProduct: response.data.product,
            isLoading: false,
          }));

          return { success: true, product: response.data.product };
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      deleteProduct: async (productId) => {
        set({ isLoading: true });
        try {
          await axios.delete(
            `${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`
          );

          // Remove deleted product from list
          set((state) => ({
            products: state.products.filter(
              (product) => product._id !== productId
            ),
            productCount: state.productCount - 1,
            isLoading: false,
          }));

          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      addProductVariant: async (productId, variantData) => {
        set({ isLoading: true });
        try {
          const product = get().products.find((p) => p._id === productId);
          if (!product) throw new Error("Product not found");

          const updatedProduct = {
            ...product,
            variants: [...(product.variants || []), variantData],
          };

          const response = await axios.put(
            `${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`,
            updatedProduct
          );

          set((state) => ({
            products: state.products.map((p) =>
              p._id === productId ? response.data.product : p
            ),
            selectedProduct: response.data.product,
            isLoading: false,
          }));

          return { success: true, product: response.data.product };
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      updateProductVariant: async (productId, variantIndex, variantData) => {
        set({ isLoading: true });
        try {
          const product = get().products.find((p) => p._id === productId);
          if (!product) throw new Error("Product not found");

          const updatedVariants = [...product.variants];
          updatedVariants[variantIndex] = {
            ...updatedVariants[variantIndex],
            ...variantData,
          };

          const updatedProduct = {
            ...product,
            variants: updatedVariants,
          };

          const response = await axios.put(
            `${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`,
            updatedProduct
          );

          set((state) => ({
            products: state.products.map((p) =>
              p._id === productId ? response.data.product : p
            ),
            selectedProduct: response.data.product,
            isLoading: false,
          }));

          return { success: true, product: response.data.product };
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      deleteProductVariant: async (productId, variantIndex) => {
        set({ isLoading: true });
        try {
          const product = get().products.find((p) => p._id === productId);
          if (!product) throw new Error("Product not found");

          if (product.variants.length === 1) {
            // If it's the last variant, delete the whole product
            return await get().deleteProduct(productId);
          }

          const updatedVariants = product.variants.filter(
            (_, idx) => idx !== variantIndex
          );
          const updatedProduct = {
            ...product,
            variants: updatedVariants,
          };

          const response = await axios.put(
            `${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`,
            updatedProduct
          );

          set((state) => ({
            products: state.products.map((p) =>
              p._id === productId ? response.data.product : p
            ),
            selectedProduct: response.data.product,
            isLoading: false,
          }));

          return { success: true, product: response.data.product };
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      // Order Management Methods
      fetchOrders: async (page = 1, limit = 10, filters = {}) => {
        set({ isLoading: true });
        try {
          let queryParams = new URLSearchParams({
            page,
            limit,
            ...filters,
          }).toString();

          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/orders?${queryParams}`
          );

          // Calculate pending orders count
          const pendingCount = response.data.orders.filter((order) =>
            ["Pending", "Processing"].includes(order.status)
          ).length;

          set({
            orders: response.data.orders || [],
            orderCount: response.data.totalCount || 0,
            pendingOrders: pendingCount,
            isLoading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, message: error.message };
        }
      },

      getOrderById: async (orderId) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/orders/${orderId}`
          );

          set({ isLoading: false });

          return { success: true, order: response.data.order };
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, message: error.message };
        }
      },

      updateOrderStatus: async (orderId, status) => {
        set({ isLoading: true });
        try {
          const response = await axios.patch(
            `${import.meta.env.VITE_SERVER_URL}/api/orders/${orderId}`,
            { status }
          );

          // Update orders list with updated order status
          set((state) => ({
            orders: state.orders.map((order) =>
              order._id === orderId ? { ...order, status } : order
            ),
            // Recalculate pending orders
            pendingOrders: state.orders.filter((order) =>
              order._id === orderId
                ? ["Pending", "Processing"].includes(status)
                : ["Pending", "Processing"].includes(order.status)
            ).length,
            isLoading: false,
          }));

          return { success: true, order: response.data.order };
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      // User/Customer Management Methods
      fetchUsers: async (page = 1, limit = 10, filters = {}) => {
        set({ isLoading: true });
        try {
          let queryParams = new URLSearchParams({
            page,
            limit,
            ...filters,
          }).toString();

          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/users?${queryParams}`
          );

          set({
            users: response.data.users || [],
            userCount: response.data.totalCount || 0,
            isLoading: false,
          });

          return response.data;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, message: error.message };
        }
      },

      getUserById: async (userId) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/users/${userId}`
          );

          set({ isLoading: false });

          return { success: true, user: response.data.user };
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, message: error.message };
        }
      },

      // Dashboard Analytics Methods
      fetchDashboardAnalytics: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/admin/analytics`
          );

          set({
            analytics: response.data,
            isLoading: false,
          });

          return { success: true, data: response.data };
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, message: error.message };
        }
      },

      // Low Stock Alerts
      fetchLowStockProducts: async (threshold = 10) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_SERVER_URL
            }/api/products/low-stock?threshold=${threshold}`
          );

          set((state) => ({
            analytics: {
              ...state.analytics,
              lowStockProducts: response.data.products,
            },
            isLoading: false,
          }));

          return { success: true, products: response.data.products };
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, message: error.message };
        }
      },

      // Inventory Management
      updateProductInventory: async (
        productId,
        variantIndex,
        sizeIndex,
        quantity
      ) => {
        set({ isLoading: true });
        try {
          const product = get().products.find((p) => p._id === productId);
          if (!product) throw new Error("Product not found");

          const updatedProduct = { ...product };
          updatedProduct.variants[variantIndex].sizeOptions[
            sizeIndex
          ].quantity = quantity;

          const response = await axios.put(
            `${import.meta.env.VITE_SERVER_URL}/api/products/${productId}`,
            updatedProduct
          );

          set((state) => ({
            products: state.products.map((p) =>
              p._id === productId ? response.data.product : p
            ),
            selectedProduct: response.data.product,
            isLoading: false,
          }));

          return { success: true, product: response.data.product };
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      // Category Management
      fetchCategories: async () => {
        set({ isLoading: true });
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/categories`
          );

          set({
            categories: response.data.categories || [],
            isLoading: false,
          });

          return { success: true, categories: response.data.categories };
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          return { success: false, message: error.message };
        }
      },

      addCategory: async (categoryData) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/categories`,
            categoryData
          );

          set((state) => ({
            categories: [...state.categories, response.data.category],
            isLoading: false,
          }));

          return { success: true, category: response.data.category };
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      updateCategory: async (categoryId, categoryData) => {
        set({ isLoading: true });
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_SERVER_URL}/api/categories/${categoryId}`,
            categoryData
          );

          set((state) => ({
            categories: state.categories.map((category) =>
              category._id === categoryId ? response.data.category : category
            ),
            isLoading: false,
          }));

          return { success: true, category: response.data.category };
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      deleteCategory: async (categoryId) => {
        set({ isLoading: true });
        try {
          await axios.delete(
            `${import.meta.env.VITE_SERVER_URL}/api/categories/${categoryId}`
          );

          set((state) => ({
            categories: state.categories.filter(
              (category) => category._id !== categoryId
            ),
            isLoading: false,
          }));

          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message,
            isLoading: false,
          });
          return {
            success: false,
            message: error.response?.data?.message || error.message,
          };
        }
      },

      // Reset error state
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "admin-storage",
      // Only persist authentication state and not all the data
      partialize: (state) => ({
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
