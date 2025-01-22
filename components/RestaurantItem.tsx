import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { getDirections } from '~/services/directions';
import { useEffect, useState } from 'react';

const RestaurantItem = ({ restaurant, userLocation }) => {
  const [direction, setDirection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered:', { restaurant, userLocation });
    const fetchDirections = async () => {
      if (restaurant && userLocation) {
        console.log('Fetching directions...');
        setLoading(true);
        try {
          const newDirections = await getDirections(
            [restaurant.lng, restaurant.lat],
            [userLocation.longitude, userLocation.latitude]
          );
          console.log('Fetched directions:', newDirections);
          setDirection(newDirections);
        } catch (err) {
          console.error('Error fetching directions:', err);
          setError(err);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Missing data:', { restaurant, userLocation });
      }
    };
    fetchDirections();
  }, [restaurant, userLocation]);
  

  return (
    <Pressable
      className="flex p-[10px] justify-start align-middle"
      onPress={() =>
        router.push({
          pathname: '/restaurantDetails/[id]',
          params: { id: restaurant.$id, name: restaurant.name },
        })
      }
    >
      <Image
        source={{
          uri: restaurant.image,
        }}
        style={styles.image}
      />
      <View className="flex-row">
        <View>
          <Text className="text-[18px] font-bold my-[5px]">
            {restaurant.name}
          </Text>
          <Text className="text-gray-500">
          ${restaurant.deliveryFee} &#8226;{' '}
          {
          loading
            ? 'Loading...'
            : error
            ? 'Error fetching directions'
            : direction?.routes[0]?.duration
            ? `${(direction.routes[0].duration / 60).toFixed()} minutes`
            : 'Unavailable'
          }
          </Text>
        </View>
        <View className="ml-[12px] mt-4 bg-gray-300 rounded-[25px] w-[35px] h-[35px] justify-center items-center">
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
});
