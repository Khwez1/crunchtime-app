import { View, Text, FlatList } from 'react-native';
import restaurants from '~/data/restaurants.json';
import DishListItem from '~/components/DishListItem';
import Header from '~/components/RestaurantHeader';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

const RestaurantDetails = () => {
  const { id } = useLocalSearchParams();  // Get restaurantId from the route params
  
  // Find the restaurant based on the dynamic id
  const restaurant = useMemo(() => restaurants.find((o) => o.id === id), [id]);

  // Ensure restaurant exists before rendering
  if (!restaurant) {
    return (
      <View>
        <Text>Restaurant not found.</Text>
      </View>
    );
  }

  return (
    <View className='flex'>
      {/* FlatList to render dishes */}
      <FlatList 
        ListHeaderComponent={() => <Header restaurant={restaurant} />}
        data={restaurant?.dishes}
        renderItem={({ item }) => <DishListItem dish={item} restaurantId={id} />}  // Pass restaurantId
        keyExtractor={(item) => item.id}  // Ensure each dish has a unique key (use dish ID here)
      />
    </View>
  );
}

export default RestaurantDetails;
