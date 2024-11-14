// app/cart/[id].tsx
import { View, Text, FlatList, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getRestaurant } from '~/lib/appwrite'; // Assuming this fetches a single restaurant by ID
import CartDishItem from '~/components/CartDishItem';
import { useCart } from '~/store/cartStore';
import { useEffect, useState } from 'react';

const Cart = () => {
  const { id } = useLocalSearchParams();
  const items = useCart((state) => state.carts[id] || []);
  const [restaurant, setRestaurant] = useState(null);

  // Find the restaurant name by id
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
          data={items}
          keyExtractor={(item) => item.id} // Update this if necessary
          renderItem={({ item }) => <CartDishItem cartDish={item} />}
        />

        <View className="h-[4px] mt-[10px] bg-gray-600" />

        <View className="flex bg-black mt-auto p-[20px] items-center">
          <Text className="text-white font-bold text-[20px]">
            Checkout
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Cart;
