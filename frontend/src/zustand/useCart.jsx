import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (item) => {
        const { cartItems } = get();
        
        // Check if item already exists with same color and size
        const existingItemIndex = cartItems.findIndex(
          (cartItem) => 
            cartItem.product._id === item.product._id && 
            cartItem.color === item.color &&
            cartItem.size === item.size
        );

        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          const updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity += item.quantity;
          set({ cartItems: updatedItems });
        } else {
          // Add new item if it doesn't exist
          set({ cartItems: [...cartItems, item] });
        }
      },

      removeFromCart: (itemId, color, size) => {
        const { cartItems } = get();
        set({
          cartItems: cartItems.filter(
            (item) => 
              !(item.product._id === itemId && 
                item.color === color && 
                item.size === size)
          )
        });
      },

      updateQuantity: (itemId, color, size, newQuantity) => {
        const { cartItems } = get();
        const updatedItems = cartItems.map(item => {
          if (item.product._id === itemId && 
              item.color === color && 
              item.size === size) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        set({ cartItems: updatedItems });
      },

      clearCart: () => set({ cartItems: [] }),

      getCartTotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => {
          return total + (item.product.images.find(img => img.color === item.color).price * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
