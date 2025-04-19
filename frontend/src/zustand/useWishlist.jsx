import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useWishlist = create(
  persist(
    (set, get) => ({
      wishlistItems: [],
      isLoading: false,
      error: null,
      
      // Add to wishlist with API integration
      addToWishlist: async (product) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post('/api/wishlist/add', { productId: product._id },{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          
          // Then update local state
          const { wishlistItems } = get();
          const existingItem = wishlistItems.find(item => item.product._id === product._id);
          
          if (!existingItem) {
            set({ 
              wishlistItems: [...wishlistItems, { product }], 
              isLoading: false 
            });
          } else {
            set({ isLoading: false });
          }
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to add item to wishlist', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Remove from wishlist with API integration
      removeFromWishlist: async (productId) => {
        set({ isLoading: true, error: null });
        try {
          // First remove from backend
          await axios.delete('/api/wishlist/remove', {
            data: { productId },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          
          
          // Then update local state
          const { wishlistItems } = get();
          set({
            wishlistItems: wishlistItems.filter(item => item.product._id !== productId),
            isLoading: false
          });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to remove item from wishlist', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Check if item is in wishlist
      isInWishlist: (productId) => {
        const { wishlistItems } = get();
        return wishlistItems.some(item => item.product._id === productId);
      },

      // Fetch wishlist from backend
      fetchWishlist: async () => {
        set({ isLoading: true, error: null });
        console.log("Hello");
        try {
          const response = await axios.get('/api/wishlist/get',{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          console.log(response.data);
          set({ wishlistItems: response.data.items || [], isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to fetch wishlist', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Clear wishlist with API integration
      clearWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete('/api/wishlist/clear',{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          set({ wishlistItems: [], isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to clear wishlist', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      wishListLogout:async()=>{
        set({wishlistItems:[]})
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
);