import { View, Text } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

const Counter = ({quantity, setQuantity}) => {

    const increment = () => {
        setQuantity(quantity + 1)
    }

    const decrement = () => {
        if(quantity > 1){
            setQuantity(quantity - 1)
        }
    }
  return (
    <View className='flex-row justify-start'>
        <AntDesign name='minuscircle' size={26} color="black" onPress={decrement} />
        <Text className='text-[18px] mt-[1px]'> {quantity} </Text>
        <AntDesign name='pluscircle' size={26} color="black" onPress={increment} />
    </View>
  )
}

export default Counter