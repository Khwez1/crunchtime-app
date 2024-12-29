import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { searchRestaurants } from '~/lib/appwrite';
import RestaurantItem from '~/components/RestaurantItem';
import Header from '~/components/Header';

const Search = () => {
  const { query } = useLocalSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const results = await searchRestaurants(query);
        setRestaurants(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchRestaurants();
    }
  }, [query]);

  if (loading) {
    return (
      <SafeAreaView className='h-full'>
        <View>
          <Text className='text-xl text-black'>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className='h-full'>
        <View>
          <Text className='text-xl text-black'>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className='flex-1 align-middle justify-center p-[10px]'>
        <Header/>
        <Text className='text-xl text-black'>Search Results for "{query}"</Text>
        <FlatList
          data={restaurants}
          renderItem={({ item }) => (
            <RestaurantItem restaurant={item} />
          )}
        />
    </View>
  );
};

export default Search;