import { View, FlatList } from 'react-native';
import RestaurantItem from '~/components/RestaurantItem';
import restaurants from '~/data/restaurants.json';

export default function Home() {
  return (
    <View className='flex-1 align-middle justify-center'>
      <FlatList 
        data={restaurants} 
        renderItem={({ item }) => <RestaurantItem restaurant={item} />} 
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

