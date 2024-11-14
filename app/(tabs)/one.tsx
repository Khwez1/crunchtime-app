import { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import RestaurantItem from '~/components/RestaurantItem';
import { getRestaurants } from '~/lib/appwrite';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    getRestaurants().then(setRestaurants)
  }, [])

  return (
    <View className='flex-1 align-middle justify-center p-[10px]'>
      <FlatList 
        data={restaurants} 
        renderItem={({ item }) => <RestaurantItem restaurant={item} />} 
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

