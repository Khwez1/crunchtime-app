import { View, Text, Image, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

const DishHeader = ({ Dish }) => {
  return (
    <>
        <Image source={{ uri: Dish.image }} style={styles.image} />
        <View className='absolute top-[40px] left-[10px]'>
            <Ionicons color="white" size={45} name='arrow-back-circle' />
        </View>
        <View className='m-[10px]'>
            <Text className="font-bold text-[35px] my-[5px]">{Dish.name}</Text>
            <Text className='text-gray-500 text-[15px]'>{Dish.description}</Text>
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

export default DishHeader