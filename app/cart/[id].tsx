// cart/[id].tsx
import { View, Text, FlatList, Image, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getRestaurant } from '~/lib/appwrite';
import CartDishItem from '~/components/CartDishItem';
import { useEffect, useState, useMemo } from 'react';
import { useCartContext } from '~/providers/CartProvider';
import { useOrderContext } from '~/providers/OrderProvider';
import { router } from 'expo-router';

const Cart = () => {
  const { id } = useLocalSearchParams(); // id is the restaurantId
  const [restaurant, setRestaurant] = useState(null);
  const { carts, loading, error } = useCartContext();
  const { createOrder } = useOrderContext();

  // Find the specific cart for this restaurant
  const currentCart = useMemo(() => {
    return carts.find(cart => cart.restaurantId === id);
  }, [carts, id]);

  // Parse cart items
  const cartItems = useMemo(() => {
    if (!currentCart) return [];
    try {
      return JSON.parse(currentCart.cartItems);
    } catch (error) {
      console.error("Error parsing cart items:", error);
      return [];
    }
  }, [currentCart]);

  // Calculate total
  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2);
  }, [cartItems]);

  // Fetch restaurant details
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const restaurantData = await getRestaurant(id);
        setRestaurant(restaurantData);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading cart...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  if (!currentCart) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No items in cart for this restaurant</Text>
      </View>
    );
  }

  return (
    <View className="flex">
      <View className="m-[10px]">
        <Text className="text-[35px] font-bold mt-[20px]">
          {restaurant?.name || 'Cart'}
        </Text>

        <Text className="font-semibold mt-[20px] text-[18px]">
          Your Items
        </Text>

        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => `${item.dishId}-${index}`}
          renderItem={({ item }) => <CartDishItem cartDish={item} />}
          ListEmptyComponent={
            <Text className="text-center py-4">No items in cart</Text>
          }
        />

        {cartItems.length > 0 && (
          <>
            <View className="h-[4px] mt-[10px] bg-gray-600" />
            <View className="mt-4 mb-4">
              <Text className="text-lg font-bold">Total: ${total}</Text>
            </View>
            <Pressable onPress={() => router.push({ pathname: '/checkout/[id]', params: { id: currentCart.restaurantId }})}>
              <Text>Go to Checkout</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

export default Cart;

