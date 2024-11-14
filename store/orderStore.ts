// store/orderStore.js
import { create } from 'zustand';
import { useCart } from './cartStore';  // Import useCart for accessing cart data
import { /* import necessary Appwrite functions */ } from '../lib/appwrite';
import { useGlobalContext } from '~/providers/GlobalProvider';

export const useOrderStore = create((set, get) => ({
  orders: [],

  // Fetch all orders for the current user
  fetchOrders: async () => {
    const { user } = useGlobalContext();
    try {
      const userOrders = await /* Appwrite function to fetch orders by userID */(user.id);
      set({ orders: userOrders });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  },

  // Create a new order based on a restaurant's cart
  createOrder: async (restaurantId) => {
    const { user } = useGlobalContext();
    const { carts, clearCart } = useCart.getState();  // Access carts and clearCart from useCart

    const cartItems = carts[restaurantId];
    if (!cartItems || cartItems.length === 0) {
      console.warn("No items in cart to create an order.");
      return;
    }

    // Calculate total price from cart items
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    try {
      // Create new order in Appwrite
      const newOrder = await /* Appwrite function to create an order */({
        userID: user.id,
        restaurantID: restaurantId,
        status: "NEW",
        total: totalPrice,
      });

      // Add each cart item to the order as an OrderDish
      await Promise.all(
        cartItems.map(async (item) => {
          await /* Appwrite function to create OrderDish */({
            quantity: item.quantity,
            orderID: newOrder.$id,
            dishID: item.id,  // Assuming each item has an ID that maps to a dish
          });
        })
      );

      // Clear the cart for this restaurant
      clearCart(restaurantId);

      // Update local orders state
      set((state) => ({ orders: [...state.orders, newOrder] }));

      return newOrder;
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  },

  // Get details of a specific order, including its dishes
  getOrder: async (id) => {
    try {
      const order = await /* Appwrite function to fetch order by ID */(id);
      const orderDishes = await /* Appwrite function to fetch OrderDishes by orderID */(id);
      return { ...order, dishes: orderDishes };
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  },
}));
