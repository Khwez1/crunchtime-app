import { View, Text } from 'react-native';

export default function Orders() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-bold">Your Orders</Text>
      <Text>No orders yet. Start shopping!</Text>
    </View>
  );
}
