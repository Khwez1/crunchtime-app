import { View, Text, Image, StyleSheet } from 'react-native'

const RestaurantHeader = ({ restaurant }) => {
    const restaurantData = Array.isArray(restaurant) ? restaurant[0] : restaurant;
    return (
    <>  
        <Image source={{ uri: restaurantData.image }} style={styles.image} />
        <View className='m-[10px]'>
            <Text className="font-bold text-[35px] my-[5px]">{restaurantData.name}</Text>
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