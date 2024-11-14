import { Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useCart } from '~/store/cartStore';
import restaurants from '~/data/restaurants.json';
import { router } from 'expo-router';

const CartsPage = () => {
  const carts = useCart((state) => state.carts);
  console.log(JSON.stringify(carts, null, 3));

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="mb-4 text-2xl font-bold">Your Carts</Text>
      {Object.keys(carts).length > 0 ? (
        Object.keys(carts).map((restaurantId) => {
          // Find restaurant details by ID
          const restaurant = restaurants.find((r) => r.id === restaurantId);
          if (!restaurant) return null;

          return (
            <TouchableOpacity
              key={restaurantId}
              className="mb-4 rounded-lg bg-white p-4 shadow-md"
              onPress={() => {
                router.push({ pathname: 'cart/[restaurantId]', params: { restaurantId }})
              }}
            >
              <Image source={{ uri: restaurant.image }} className="w-20 h-20 mb-4 rounded" />
              <Text className="text-xl font-semibold">{restaurant.name}</Text>
              <Text className="text-gray-500">{carts[restaurantId].length} items</Text>
              <Text className="mt-2 font-semibold text-gray-700">
                Total: $
                {carts[restaurantId]
                  .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
                  .toFixed(2)}
              </Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text className="text-gray-500">You have no items in your carts.</Text>
      )}
    </ScrollView>
  );
};

export default CartsPage;
