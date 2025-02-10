import React, { useState, useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import Header from '~/components/Header';
import Tags from '~/components/Tags';
import Catergories from '~/components/Catergories';
import RestaurantItem from '~/components/RestaurantItem';
import { getRestaurants } from '~/lib/appwrite';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    if (!userLocation) return;

    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const fetchedRestaurants = await getRestaurants(userLocation.longitude, userLocation.latitude);

        let filteredRestaurants = [...fetchedRestaurants];

        // Sorting based on selected filter
        if (selectedFilter === 'Nearby') {
          filteredRestaurants.sort((a, b) => a.distance - b.distance);
        } else if (selectedFilter === 'Rated') {
          filteredRestaurants.sort((a, b) => b.rating - a.rating);
        } else if (selectedFilter === 'Price') {
          filteredRestaurants.sort((a, b) => a.deliveryFee - b.deliveryFee);
        }

        setRestaurants(filteredRestaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [userLocation, selectedFilter]);

  return (
    <View className="flex-1 p-[10px]">
      <Header onLocationFetched={setUserLocation} />
      <Tags onTagSelect={setSelectedFilter} selectedFilter={selectedFilter} />
      <Catergories />
      <View className='border-b border-gray-300'>
        <Text className="text-2xl ml-[6px] font-bold">Featured on Crunch Time</Text>
        <Text className="text-md ml-[10px] underline">Suggestions</Text>
        {!loading && restaurants?.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={({ item }) => (
              <RestaurantItem restaurant={item} userLocation={userLocation} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
      <View className='border-b mt-[8px] border-gray-300'>
        <Text className="text-2xl ml-[6px] font-bold">Your Favourites</Text>
        {!loading && restaurants?.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={({ item }) => (
              <RestaurantItem restaurant={item} userLocation={userLocation} />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
  );
}
