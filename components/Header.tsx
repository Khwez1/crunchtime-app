import { View, Text, Image, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import restaurants from '~/data/restaurants.json';
const restaurant = restaurants[0];

const Header = () => {
  return (
    <>
        <Image source={{ uri: restaurant.image }} style={styles.image} />
        <View className='absolute top-[40px] left-[10px]'>
            <Ionicons color="white" size={45} name='arrow-back-circle' />
        </View>
        <View className='m-[10px]'>
            <Text className="font-bold text-[35px] my-[5px]">{restaurant.name}</Text>
            <Text className='text-gray-500 text-[15px]'>{restaurant.deliveryFee} &#8226; {restaurant.minDeliveryTime} - {restaurant.maxDeliveryTime} minutes</Text>
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

export default Header