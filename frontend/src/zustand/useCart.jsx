import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useCart = create(
  persist(
    (set, get) => ({
      cartItems: [],
      isLoading: false,
      error: null,
      
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
      const updatedQuantity = cartItems[existingItemIndex].quantity + item.quantity;
      
      if (updatedQuantity > cartItems[existingItemIndex].product.quantity) {
        set({
          error: 'Not enough stock available',
          isLoading: false
        });
        return { success: false, error: 'Not enough stock available' };
      }

      await axios.put('/api/cart/update', {
        productId: item.product._id,
        color: item.color,
        size: item.size,
        quantity: updatedQuantity
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }

      });

      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity = updatedQuantity;
      set({ cartItems: updatedItems, isLoading: false });
      
    } else {
      // If item is new, add it via API
      const response = await axios.post('/api/cart/add', item,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }

      });
      set({ 
        cartItems: [...cartItems, response.data.item || item], 
        isLoading: false 
      });
    }
    return { success: true };
  } catch (error) {
    set({ 
      error: error.response?.data?.message || 'Failed to add item to cart', 
      isLoading: false 
    });
    return { success: false, error: error.response?.data?.message };
  }
}    ,                   

      // Remove from cart with API integration
      removeFromCart: async (itemId, color, size) => {
        set({ isLoading: true, error: null });
        try {
          // First remove from backend
          await axios.delete('/api/cart/remove', { 
            data: { productId: itemId, color, size },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
          
          // Then update local state
          const { cartItems } = get();
          set({
            cartItems: cartItems.filter(
              (item) => 
                !(item.product._id === itemId && 
                  item.color === color && 
                  item.size === size)
            ),
            isLoading: false
          });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to remove item from cart', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Update quantity with API integration
      updateQuantity: async (itemId, color, size, newQuantity) => {
        set({ isLoading: true, error: null });
        try {
          // First update on backend
          console.log(localStorage.getItem('token'))
          await axios.put('/api/cart/update', {
            productId: itemId,
            color,
            size,
            quantity: newQuantity
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          
          // Then update local state
          const { cartItems } = get();
          const updatedItems = cartItems.map(item => {
            if (item.product._id === itemId && 
                item.color === color && 
                item.size === size) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          });
          set({ cartItems: updatedItems, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to update cart', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Fetch cart from backend
      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get('/api/cart/get',{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });

          console.log(response.data)
          set({ cartItems: response.data.items || [], isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to fetch cart', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      // Clear cart with API integration
      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.delete('/api/cart/clear',{
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          set({ cartItems: [], isLoading: false });
          return { success: true };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Failed to clear cart', 
            isLoading: false 
          });
          return { success: false, error: error.response?.data?.message };
        }
      },

      getCartTotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      },
      cartLogout:async()=>{
        console.log("cart logging out");
        set({cartItems:[]})
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);