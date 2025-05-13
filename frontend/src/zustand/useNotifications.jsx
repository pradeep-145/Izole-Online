import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Configuration values
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
let fetchPromise = null; // For request debouncing

export const useNotifications = create(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      lastFetchTime: null,

      fetchNotifications: async (forceRefresh = false) => {
        const { lastFetchTime, isLoading } = get();
        const now = Date.now();

        // Skip the request if:
        // 1. Already loading
        // 2. Not a forced refresh and data is fresh
        if (
          isLoading ||
          (!forceRefresh && lastFetchTime && now - lastFetchTime < CACHE_TTL)
        ) {
          return { success: true, notifications: get().notifications };
        }

        // Debounce multiple simultaneous requests
        if (fetchPromise) {
          return fetchPromise;
        }

        // Get the token from localStorage
        const token = localStorage.getItem("token");

        // If no token is present, don't make the request
        if (!token) {
          set({ error: "Not authenticated" });
          return { success: false, error: "Not authenticated" };
        }

        set({ isLoading: true, error: null });

        fetchPromise = axios
          .get(
            "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/notifications/get-notifications",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            set({
              notifications: response.data.notifications || [],
              unreadCount: response.data.unreadCount || 0,
              isLoading: false,
              lastFetchTime: Date.now(),
            });
            return {
              success: true,
              notifications: response.data.notifications,
              unreadCount: response.data.unreadCount,
            };
          })
          .catch((error) => {
            // If unauthorized, don't keep retrying
            if (error.response && error.response.status === 401) {
              set({
                error: "Authentication required",
                isLoading: false,
                // Don't update lastFetchTime to allow future retries when user logs in
              });
            } else {
              set({
                error:
                  error.response?.data?.message ||
                  "Failed to fetch notifications",
                isLoading: false,
              });
            }
            return {
              success: false,
              error:
                error.response?.data?.message ||
                "Failed to fetch notifications",
            };
          })
          .finally(() => {
            fetchPromise = null;
          });

        return fetchPromise;
      },

      markAsRead: async (notificationId) => {
        const token = localStorage.getItem("token");
        if (!token) {
          return { success: false, error: "Not authenticated" };
        }

        try {
          await axios.patch(
            `https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/notifications/mark-read/${notificationId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification._id === notificationId
                ? { ...notification, read: true }
                : notification
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));

          return { success: true };
        } catch (error) {
          console.error("Error marking notification as read:", error);
          return {
            success: false,
            error:
              error.response?.data?.message ||
              "Failed to mark notification as read",
          };
        }
      },

      markAllAsRead: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          return { success: false, error: "Not authenticated" };
        }

        try {
          await axios.patch(
            "https://uzlmegb12i.execute-api.ap-south-1.amazonaws.com/api/notifications/mark-all-read",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          set((state) => ({
            notifications: state.notifications.map((notification) => ({
              ...notification,
              read: true,
            })),
            unreadCount: 0,
          }));

          return { success: true };
        } catch (error) {
          console.error("Error marking all notifications as read:", error);
          return {
            success: false,
            error:
              error.response?.data?.message ||
              "Failed to mark all notifications as read",
          };
        }
      },

      // Poll for new notifications (to be used in useEffect)
      startPolling: (interval = 30000) => {
        // Check if user is authenticated before polling
        if (!localStorage.getItem("token")) {
          console.log("Not polling for notifications: User not authenticated");
          return null;
        }

        const pollId = setInterval(() => {
          // Only poll when tab is visible and user is authenticated
          if (
            document.visibilityState === "visible" &&
            localStorage.getItem("token")
          ) {
            get().fetchNotifications();
          }
        }, interval);

        return pollId;
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0, lastFetchTime: null });
      },
    }),
    {
      name: "notifications-storage",
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
        lastFetchTime: state.lastFetchTime,
      }),
    }
  )
);
