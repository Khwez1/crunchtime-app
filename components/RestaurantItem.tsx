import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { updateProfile, client } from '~/lib/appwrite';
import { getDirections } from '~/services/directions';
import { MaterialIcons } from '@expo/vector-icons';
import { useGlobalContext } from '~/providers/GlobalProvider';

const RestaurantItem = ({ restaurant, userLocation }) => {
  const [direction, setDirection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const { fetchUserProfile, user } = useGlobalContext();
  const isFavorited = userFavorites.includes(restaurant.$id);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        const profile = await fetchUserProfile(user.$id);
        setUserFavorites(profile?.favorites || []);
      }
    };
    fetchFavorites();
  }, [user]);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${'669a5a3d003d47ff98c7'}.collections.${'669a5a7f000cea3cde9d'}.documents.${user?.$id}`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.update')) {
          console.log('User favorites updated:', response.payload.favorites);
          setUserFavorites(response.payload.favorites || []);
        }
      }
    );
    return () => unsubscribe();
  }, [user, userFavorites]);

  useEffect(() => {
    if (restaurant && userLocation) {
      setLoading(true);
      getDirections([restaurant.lng, restaurant.lat], [userLocation.longitude, userLocation.latitude])
        .then(newDirections => setDirection(newDirections))
        .catch(err => setError(err))
        .finally(() => setLoading(false));
    }
  }, [restaurant, userLocation]);

  async function toggleFavorite() {
    try {
      const updatedFavorites = isFavorited
        ? userFavorites.filter(id => id !== restaurant.$id)
        : [...userFavorites, restaurant.$id];
      const profile = await fetchUserProfile(user.$id);
      await updateProfile(profile.$id, { favorites: updatedFavorites });
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  }

  return (
    <Pressable 
      className='flex p-[10px] justify-start align-middle'
      onPress={() => 
        router.push({ 
          pathname: '/restaurantDetails/[id]',
          params: { id: restaurant.$id, name: restaurant.name } 
        })
      }
    >
      <View className="relative">
        {/* Herat Icon */}
        <Pressable 
          className="absolute top-3 left-3 z-10" 
          onPress={() => toggleFavorite()}
        >
          <MaterialIcons 
            name={isFavorited ? "favorite" : "favorite-border"} 
            size={24} 
            color={isFavorited ? "red" : "white"} 
          />
        </Pressable>
        <Image 
          source={{ uri: restaurant.image }} 
          style={styles.image} 
        />
      </View>
      <View className="flex-row">

        <View>
          <Text className="text-[18px] font-bold my-[5px]">{restaurant.name}</Text>
          <Text className="text-gray-500">
            ${restaurant.deliveryFee} &#8226; {loading ? 'Loading...' : error ? 'Error' : direction?.routes[0]?.duration ? `${(direction.routes[0].duration / 60).toFixed()} minutes` : 'Unavailable'}
          </Text>
        </View>

        <View className="ml-3 mt-1 bg-gray-300 rounded-full w-9 h-9 justify-center items-center">
          <Text className="font-bold">{restaurant.rating}</Text>
        </View>

      </View>
    </Pressable>
  );
};

export default RestaurantItem;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
})