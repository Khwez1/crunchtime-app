import { View, Image, Text } from 'react-native';

const CartDishItem = ({ cartDish }) => {
    return (
        <View className="flex-row items-center px-[10px] my-[15px]">
            <Image source={{ uri: cartDish.image }} className="h-[40px] w-[40px] rounded-2xl mr-3" />
            <View className="bg-gray-300 px-[5px] py-[2px] mr-[6px] rounded-md">
                <Text>{cartDish.quantity}</Text>
            </View>
            <View>
                <Text className="font-[600]">{cartDish.name}</Text>
                {/* Display required extras */}
                {cartDish.requiredExtras && Object.keys(cartDish.requiredExtras).map((extraName) => (
                    <Text key={extraName} className="text-gray-600">
                        {extraName}: {cartDish.requiredExtras[extraName].name} (+${cartDish.requiredExtras[extraName].price})
                    </Text>
                ))}

                {/* Display optional extras */}
                {cartDish.optionalExtras && cartDish.optionalExtras.length > 0 && (
                    <Text className="text-gray-600">Optional Add-ons:</Text>
                )}
                {cartDish.optionalExtras.map((extra, index) => (
                    <Text key={index} className="text-gray-600">
                        {extra.name} (+${extra.price})
                    </Text>
                ))}
            </View>
            <Text className="ml-auto font-semibold">${cartDish.totalPrice.toFixed(2)}</Text>
        </View>
    );
};

export default CartDishItem;
