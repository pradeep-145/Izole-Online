import axios from "axios";
import { create } from "zustand";

// Configuration values
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes in milliseconds
let fetchPromise = null; // For request debouncing

export const useAdminNotifications = create((set, get) => ({
  notifications: [],
  analytics: {
    total: 0,
    unread: 0,
    today: 0,
    growth: 0,
    byType: { order: 0, promotion: 0, general: 0 },
  },
  isLoading: false,
  error: null,
  lastFetchTime: null,

  // Fetch notifications with optional filters
  fetchNotifications: async (options = {}) => {
    const {
      forceRefresh = false,
      type = "all",
      status = "all",
      page = 1,
      limit = 20,
    } = options;

    const now = Date.now();
    const { lastFetchTime, isLoading } = get();

    // Skip if already loading or if data is fresh
    if (
      isLoading ||
      (!forceRefresh && lastFetchTime && now - lastFetchTime < CACHE_TTL)
    ) {
      return { success: true };
    }

    // Debounce multiple simultaneous requests
    if (fetchPromise) {
      return fetchPromise;
    }

    set({ isLoading: true, error: null });

    fetchPromise = axios
      .get(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          params: { type, status, page, limit },
        }
      )
      .then((response) => {
        set({
          notifications: response.data.notifications || [],
          pagination: {
            page: response.data.meta.page,
            limit: response.data.meta.limit,
            total: response.data.meta.total,
            pages: response.data.meta.pages,
          },
          isLoading: false,
          lastFetchTime: Date.now(),
          error: null,
        });

        // Also fetch analytics to keep them in sync
        get().fetchAnalytics();

        return { success: true, data: response.data };
      })
      .catch((error) => {
        set({
          isLoading: false,
          error:
            error.response?.data?.message || "Failed to fetch notifications",
        });
        return {
          success: false,
          error:
            error.response?.data?.message || "Failed to fetch notifications",
        };
      })
      .finally(() => {
        fetchPromise = null;
      });

    return fetchPromise;
  },

  // Fetch notification analytics
  fetchAnalytics: async () => {
    try {
      const response = await axios.get(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications/analytics",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      set({
        analytics: response.data.analytics || {
          total: 0,
          unread: 0,
          today: 0,
          growth: 0,
          byType: { order: 0, promotion: 0, general: 0 },
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching notification analytics:", error);
      return { success: false, error: error.message };
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await axios.patch(
        `https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications/mark-read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        ),
      }));

      // Update analytics after marking as read
      get().fetchAnalytics();

      return { success: true };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return { success: false, error: error.message };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (type = "all") => {
    try {
      await axios.patch(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications/mark-all-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          params: { type },
        }
      );

      set((state) => ({
        notifications: state.notifications.map((notification) =>
          type === "all" || notification.type === type
            ? { ...notification, read: true }
            : notification
        ),
      }));

      // Update analytics after marking all as read
      get().fetchAnalytics();

      return { success: true };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return { success: false, error: error.message };
    }
  },

  // Send notification to customers
  sendNotification: async (notificationData) => {
    try {
      await axios.post(
        "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications/send",
        notificationData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh notifications after sending
      get().fetchNotifications({ forceRefresh: true });

      return { success: true };
    } catch (error) {
      console.error("Error sending notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      await axios.delete(
        `https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/admin/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification._id !== notificationId
        ),
      }));

      // Update analytics after deletion
      get().fetchAnalytics();

      return { success: true };
    } catch (error) {
      console.error("Error deleting notification:", error);
      return { success: false, error: error.message };
    }
  },

  // Clear store (for logout)
  clearStore: () => {
    set({
      notifications: [],
      analytics: {
        total: 0,
        unread: 0,
        today: 0,
        growth: 0,
        byType: { order: 0, promotion: 0, general: 0 },
      },
      isLoading: false,
      error: null,
      lastFetchTime: null,
    });
  },
}));
