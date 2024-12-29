import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

const RestaurantItem = ({ restaurant }) => {
  return (
    <Pressable className='flex p-[10px] justify-start align-middle' onPress={() => router.push({pathname:'/restaurantDetails/[id]', params: {id: restaurant.$id, name : restaurant.name}})}> 
      <Image 
        source={{
            uri: restaurant.image
        }}
        style={styles.image}
      />
      <View className='flex-row'>

        <View>
          <Text className='text-[18px] font-bold my-[5px]'>{restaurant.name}</Text>
          <Text className='text-gray-500'>
            ${restaurant.deliveryFee} &#8226; {restaurant.minDeliveryTime} - {restaurant.maxDeliveryTime} minutes
          </Text>
        </View>

        <View className='ml-auto mt-4 bg-gray-300 rounded-[25px] w-[35px] h-[35px] justify-center items-center'>
          <Text className='font-bold'>
            {restaurant.rating}
          </Text>
        </View>

      </View>
    </Pressable>
  );
}

export default RestaurantItem

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 8, // Add spacing between items
    width: 150, // Set a fixed width for items
  },
  image: {
    width: '100%', 
    height: 150, // Adjust the height of the image
    borderRadius: 8,
  },
  restaurantName: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
