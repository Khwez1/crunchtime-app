import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGlobalContext } from '~/providers/GlobalProvider';
import { databases, Query, ID } from '../lib/appwrite';

const DATABASE_ID = '669a5a3d003d47ff98c7';
const CART_COLLECTION_ID = '6731d6a50011b3248698';

const CartContext = createContext();
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [carts, setCarts] = useState([]);
  
  const fetchCarts = async () => {
    if (!user?.$id) {
      setError('User is not logged in.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await databases.listDocuments(DATABASE_ID, CART_COLLECTION_ID, [
        Query.equal('userId', user.$id),
      ]);

      setCarts(response.documents || []);
    } catch (error) {
      setError(`Error fetching carts: ${error.message}`);
      console.error('Error fetching carts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCartByRestaurantId = (restaurantId) => {
    return carts.find(cart => cart.restaurantId === restaurantId);
  };

  const calculateExtrasPrice = (requiredExtras, optionalExtras) => {
    const optionalExtrasTotal = optionalExtras.reduce((sum, extra) => sum + extra.price, 0);
    const requiredExtrasTotal = Object.values(requiredExtras).reduce((sum, extra) => sum + extra.price, 0);
    return optionalExtrasTotal + requiredExtrasTotal;
  };


  const addProduct = async (
    dish,
    restaurantId,
    quantity = 1, // Default to 1 if not provided
    requiredExtras = [],
    optionalExtras = []
  ) => {
    if (!user?.$id) {
      setError('User ID is missing.');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      // Get the cart for this specific restaurant
      const existingCart = getCartByRestaurantId(restaurantId);
      const extrasPrice = calculateExtrasPrice(requiredExtras, optionalExtras);
      
      const newCartItem = {
        dishId: dish.$id,
        name: dish.name,
        image: dish.image,
        price: dish.price,
        quantity: 1, // Always add one item
        requiredExtras,
        optionalExtras,
        totalPrice: (dish.price + extrasPrice),
      };
  
      if (existingCart) {
        // Update existing cart for this restaurant
        const cartItems = JSON.parse(existingCart.cartItems);
        
        // Check for existing dish with same extras
        const existingItemIndex = cartItems.findIndex(item => 
          item.dishId === dish.$id && 
          JSON.stringify(item.requiredExtras) === JSON.stringify(requiredExtras) &&
          JSON.stringify(item.optionalExtras) === JSON.stringify(optionalExtras)
        );
  
        if (existingItemIndex !== -1) {
          // Update quantity if dish already exists with same extras
          cartItems[existingItemIndex].quantity += 1; // Increase by 1
          cartItems[existingItemIndex].totalPrice = (cartItems[existingItemIndex].price + extrasPrice) * cartItems[existingItemIndex].quantity;
        } else {
          cartItems.push(newCartItem);
        }
  
        await databases.updateDocument(DATABASE_ID, CART_COLLECTION_ID, existingCart.$id, {
          cartItems: JSON.stringify(cartItems),
        });
      } else {
        // Create a new cart for this restaurant
        await databases.createDocument(DATABASE_ID, CART_COLLECTION_ID, ID.unique(), {
          userId: user.$id,
          restaurantId,
          cartItems: JSON.stringify([newCartItem]),
        });
      }
  
      // Refresh carts after updating
      await fetchCarts();
    } catch (error) {
      setError(`Error managing cart: ${error.message}`);
      console.error('Error managing cart:', error);
      throw error; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCarts();
    } else {
      setCarts([]);
    }
  }, [user]);

  const updateProductQuantity = async (
    dish,
    restaurantId,
    newQuantity,
    itemIndex,
    requiredExtras = [],
    optionalExtras = []
  ) => {
    if (!user?.$id) {
      setError('User ID is missing.');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      const existingCart = getCartByRestaurantId(restaurantId);
      if (existingCart) {
        const cartItems = JSON.parse(existingCart.cartItems);
        const currentItem = cartItems[itemIndex];
        const extrasPrice = calculateExtrasPrice(requiredExtras, optionalExtras);
  
        if (currentItem) {
          currentItem.quantity = newQuantity;
          currentItem.totalPrice = (currentItem.price + extrasPrice) * newQuantity;
  
          await databases.updateDocument(DATABASE_ID, CART_COLLECTION_ID, existingCart.$id, {
            cartItems: JSON.stringify(cartItems),
          });
        }
      }
  
      // Refresh carts after updating
      await fetchCarts();
    } catch (error) {
      setError(`Error updating quantity: ${error.message}`);
      console.error('Error updating quantity:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const removeProduct = async (dish, restaurantId, itemIndex) => {
    if (!user?.$id) {
      setError('User ID is missing.');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      const existingCart = getCartByRestaurantId(restaurantId);
      if (existingCart) {
        let cartItems = JSON.parse(existingCart.cartItems);
        cartItems.splice(itemIndex, 1); // Remove the item
  
        if (cartItems.length > 0) {
          await databases.updateDocument(DATABASE_ID, CART_COLLECTION_ID, existingCart.$id, {
            cartItems: JSON.stringify(cartItems),
          });
        } else {
          // If cart is empty after removal, consider deleting the cart or marking it as empty
          await databases.deleteDocument(DATABASE_ID, CART_COLLECTION_ID, existingCart.$id);
        }
      }
  
      // Refresh carts after updating
      await fetchCarts();
    } catch (error) {
      setError(`Error removing product: ${error.message}`);
      console.error('Error removing product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    addProduct,
    updateProductQuantity,  // Make sure this is included
    removeProduct,
    loading,
    error,
    carts,
    fetchCarts,
    getCartByRestaurantId
  };

 

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;