import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import DishListItem from '~/components/DishListItem';
import Header from '~/components/RestaurantHeader';
import { router, Stack, useLocalSearchParams, } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { getRestaurant, getDishes } from '~/lib/appwrite';
import { useCartContext } from '~/providers/CartProvider';

const RestaurantDetails = () => {
  const navigation = useNavigation();
  const { id, name } = useLocalSearchParams(); // Get restaurantId from the route params
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { carts } = useCartContext();
  
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

  // Fetch restaurant and dishes data
  useEffect(() => {
    if(!id){
      return;
    }
    // Fetch restaurant details
    getRestaurant(id)
    .then((res) => {
      const restaurantData = res.documents ? res.documents[0] : res;  // Adjust if it's inside 'documents'
      setRestaurant(restaurantData);
    })
    .catch(console.error);
    // Fetch dishes associated with the restaurant
    getDishes(id)
      .then(setDishes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Display loading spinner or not found message if no restaurant data
  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View>
        <Text>Restaurant not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex">
      <Stack.Screen
        options={{
          title: name || 'Restaurant Details', // Use restaurant name or fallback
        }}
      />
      {/* FlatList to render dishes */}
      <FlatList 
        ListHeaderComponent={() => <Header restaurant={restaurant} />}
        data={dishes}
        renderItem={({ item }) => <DishListItem dish={item} restaurantId={id} />}
        keyExtractor={(item) => item.$id} // Ensure each dish has a unique key (use dish ID here)
      />
      {cartItems.length > 0 && (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            alignItems: 'center',
          }}>
          <Pressable 
            style={{
              backgroundColor: 'red',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              width: '100%',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={() => router.push({ pathname: '/cart/[id]', params: { id } })}
          >
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>View Cart ({cartItems.length} items)</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default RestaurantDetails;
