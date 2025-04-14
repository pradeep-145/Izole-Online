import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useProduct = create(
  persist(
    (set, get) => ({
      products: [],
      isInitialized: false,
      setProducts: (products) => set({ products }),
      fetchProductsIfEmpty: async () => {
        // Get the persisted state
        const state = get();
        
        // Check if we already have data in localStorage
        if (state.isInitialized && state.products.length > 0) {
          return; // Exit if we already have data
        }

        try {
          var response = null;
          if(!response)
          response = await axios.get('/api/products/get-products');
          const data = await response.data;
          set({ 
            products: data.result,
            isInitialized: true 
          });
          console.log(data);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      },
      // Add a method to clear the store if needed
      clearStore: () => {
        set({ products: [], isInitialized: false });
      },
    }),
    {
      name: 'products-storage',
      storage: localStorage,
      // Add version control for cache busting if needed
      version: 1,
    }
  )
);
