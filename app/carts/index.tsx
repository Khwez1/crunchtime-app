import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useCartContext } from '~/providers/CartProvider';
import { useState, useEffect } from 'react';
import { getRestaurants } from '~/lib/appwrite';

const CartsPage = () => {
  const { carts, loading: cartsLoading, error: cartsError } = useCartContext();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const restaurantsData = await getRestaurants();
        setRestaurants(restaurantsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || cartsLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  if (error || cartsError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{error || cartsError}</Text>
      </View>
    );
  }

  const calculateCartTotal = (cartItems) => {
    const items = JSON.parse(cartItems);
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Your Carts</Text>

        {carts.length > 0 ? (
          carts.map((cart) => {
            const restaurant = restaurants.find((r) => r.$id === cart.restaurantId);
            if (!restaurant) return null;

            const cartItems = JSON.parse(cart.cartItems);
            const totalAmount = calculateCartTotal(cart.cartItems);

            return (
              <TouchableOpacity
                key={cart.$id}
                className="bg-white rounded-lg shadow-md p-4 mb-4"
                onPress={() => {
                  router.push({
                    pathname: 'cart/[restaurantId]',
                    params: { restaurantId: cart.restaurantId }
                  });
                }}
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-lg font-semibold">{restaurant.name}</Text>
                    <Text className="text-gray-600">
                      {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-lg font-semibold">
                      Total: ${totalAmount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View className="items-center justify-center py-8">
            <Text className="text-gray-500 text-lg">
              You have no items in your carts.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CartsPage;