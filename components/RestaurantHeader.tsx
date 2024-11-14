import { View, Text, Image, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

const RestaurantHeader = ({ restaurant }) => {
    const restaurantData = Array.isArray(restaurant) ? restaurant[0] : restaurant;
    return (
    <>  
        {/* {restaurant.image && ( */}
        <Image source={{ uri: restaurantData.image }} style={styles.image} />
        {/* )} */}
        <View className='absolute top-[40px] left-[10px]'>
            <Ionicons color="white" size={45} name='arrow-back-circle' />
        </View>
        <View className='m-[10px]'>
            <Text className="font-bold text-[35px] my-[5px]">{restaurantData.name}</Text>
            <Text className='text-gray-500 text-[15px]'>{restaurantData.deliveryFee} &#8226; {restaurant.minDeliveryTime} - {restaurant.maxDeliveryTime} minutes</Text>
        </View>
    </>
  )
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        aspectRatio: 5 / 3
    }
})

export default RestaurantHeader