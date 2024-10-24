import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import restaurants from '~/data/restaurants.json';
import DishListItem from '~/components/DishListItem';
import Header from '~/components/Header';
const restaurant = restaurants[0];

const RestaurantDetails = () => {
    return (
        <View className='flex'>
            <FlatList 
            ListHeaderComponent={Header}
            data={restaurant.dishes}
            renderItem={({ item }) => <DishListItem dish={item} />} />
        </View>
    )
}

export default RestaurantDetails