import { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import Catergories from '~/components/Catergories';
import Header from '~/components/Header';
import RestaurantItem from '~/components/RestaurantItem';
import Tags from '~/components/Tags';
import { getRestaurants } from '~/lib/appwrite';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    getRestaurants().then(setRestaurants)
  }, [])

  return (
    <View className='flex-1 align-middle justify-center p-[10px]'>
      <Header />
      <Tags />
      <Catergories />
      <View className='flex-1'>
        <Text className='text-3xl font-medium'>
          Your Favourites
        </Text>
        <Text className='text-lg'>
          Your frequent orders
        </Text>
        <FlatList 
          data={restaurants} 
          renderItem={({ item }) => <RestaurantItem restaurant={item} />} 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

