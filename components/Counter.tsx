import { View, Text } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

const Counter = ({count, setCount}) => {

    const increment = () => {
        setCount(count + 1)
    }

    const decrement = () => {
        if(count > 1){
            setCount(count - 1)
        }
    }
  return (
    <View className='flex-row justify-start'>
        <AntDesign name='minuscircle' size={26} color="black" onPress={decrement} />
        <Text className='text-[18px] mt-[1px]'> {count} </Text>
        <AntDesign name='pluscircle' size={26} color="black" onPress={increment} />
    </View>
  )
}

export default Counter