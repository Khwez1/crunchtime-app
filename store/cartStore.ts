// store/cartStore.js
import { create } from 'zustand';
export const useCart = create((set) => ({
  carts: {},

  addProduct: (dish, restaurantId, quantity = 1, requiredExtras = [], optionalExtras = []) =>
    set((state) => {
      const currentCart = state.carts[restaurantId] || [];

      // Calculate total price based on quantity and extras
      const extrasPrice = optionalExtras.reduce((acc, extra) => acc + extra.price, 0)
        + Object.values(requiredExtras).reduce((acc, extra) => acc + extra.price, 0);
      const totalPrice = (dish.price + extrasPrice) * quantity;

      // Add dish with details to cart
      const updatedCart = [
        ...currentCart,
        { 
          ...dish,
          quantity,
          requiredExtras,
          optionalExtras,
          totalPrice,
        },
      ];

      return {
        carts: {
          ...state.carts,
          [restaurantId]: updatedCart,
        },
      };
    }),
}));
