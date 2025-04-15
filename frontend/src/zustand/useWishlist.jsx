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
          // First add to backend
          const response = await axios.post('https://lcnfyb0s62.execute-api.ap-south-1.amazonaws.com/api/wishlist/add', { productId: product._id },{
            headers:{
              Authorization:localStorage.getItem('token')
            },
            withCredentials:true
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
          await axios.delete('https://lcnfyb0s62.execute-api.ap-south-1.amazonaws.com/api/wishlist/remove', { 
            data: { productId } 
          },{
            headers:{
              Authorization:localStorage.getItem('token')
            },
            withCredentials:true
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
          var response=null;
          if(!response)
          response = await axios.get('https://lcnfyb0s62.execute-api.ap-south-1.amazonaws.com/api/wishlist/get',{
            headers:{
              Authorization:localStorage.getItem('token')
            },
        withCredentials:true});
          
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
          await axios.delete('https://lcnfyb0s62.execute-api.ap-south-1.amazonaws.com/api/wishlist/clear',{
            headers:{
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials:true
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
      }
    }),
    {
      name: 'wishlist-storage',
    }
  )
);