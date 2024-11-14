import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import DishListItem from '~/components/DishListItem';
import Header from '~/components/RestaurantHeader';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getRestaurant, getDishes } from '~/lib/appwrite';

const RestaurantDetails = () => {
  const { id } = useLocalSearchParams(); // Get restaurantId from the route params
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);  
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
      {/* FlatList to render dishes */}
      <FlatList 
        ListHeaderComponent={() => <Header restaurant={restaurant} />}
        data={dishes}
        renderItem={({ item }) => <DishListItem dish={item} restaurantId={id} />}
        keyExtractor={(item) => item.$id} // Ensure each dish has a unique key (use dish ID here)
      />
    </View>
  );
};

export default RestaurantDetails;
