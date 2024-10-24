import { View, Text, Image, StyleSheet } from 'react-native';

const RestaurantItem = ({ restaurant }) => {
  return (
    <View className='flex p-[10px] justify-center align-middle'>
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
                <Text className='font-bold'>{restaurant.rating}</Text>
            </View>

        </View>
    </View>
  );
}

export default RestaurantItem

const styles = StyleSheet.create({
  image: {
    width: "100%",
    aspectRatio: 5 / 3,
    marginBottom: 5
  }
});
