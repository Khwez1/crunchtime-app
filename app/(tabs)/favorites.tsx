import { useEffect, useState } from 'react';
import { View } from 'react-native';
import RestaurantItem from '~/components/RestaurantItem';
import { fetchUserFavorites, getFavoriteRestaurants } from '~/lib/appwrite';
import { useGlobalContext } from '~/providers/GlobalProvider';

const FavoritesScreen = ({ userId }) => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const { user, fetchUserProfile } = useGlobalContext();
  useEffect(() => {
    const fetchFavorites = async () => {
      const profile = await fetchUserProfile(user?.$id);
      const favoriteIds = await fetchUserFavorites(profile?.$id);
      const restaurants = await getFavoriteRestaurants(favoriteIds);
      setFavoriteRestaurants(restaurants);
    };

    fetchFavorites();
  }, [userId]);

  return (
    <View>
      {favoriteRestaurants.map(restaurant => (
        <RestaurantItem key={restaurant.$id} restaurant={restaurant} />
      ))}
    </View>
  );
};

export default FavoritesScreen;