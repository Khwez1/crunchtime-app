// CartDishItem.tsx
import { View, Image, Text } from 'react-native';
import { useCartContext } from '~/providers/CartProvider';
import QuantityCounter from './QuantityCounter';

const CartDishItem = ({ cartDish, restaurantId, onDelete }) => {
  const { updateCartItemQuantity } = useCartContext();

  const handleIncrement = () => {
    updateCartItemQuantity(restaurantId, cartDish.dishId, cartDish.quantity + 1);
  };

  const handleDecrement = () => {
    if (cartDish.quantity > 1) {
      updateCartItemQuantity(restaurantId, cartDish.dishId, cartDish.quantity - 1);
    } else {
      onDelete(cartDish)
    }
  };
  
  return (
    <View className="my-[15px] flex-row items-center px-[10px]">
      <Image source={{ uri: cartDish.image }} className="mr-3 h-[40px] w-[40px] rounded-2xl" />
      <View className="mr-[6px] rounded-md bg-gray-300 px-[5px] py-[2px]">
        <Text>{cartDish.quantity}</Text>
      </View>

      <View className="flex-1">
        <Text className="font-[600]">{cartDish.name}</Text>

        {/* Display required extras */}
        {Object.entries(cartDish.requiredExtras).map(([extraName, extra]) => (
          <Text key={extraName} className="text-gray-600">
            {extraName}: {extra.name} (+${extra.price.toFixed(2)})
          </Text>
        ))}

        {/* Display optional extras */}
        {cartDish.optionalExtras && cartDish.optionalExtras.length > 0 && (
          <>
            {cartDish.optionalExtras.map((extra, index) => (
              <Text key={index} className="text-gray-600">
                {extra.name} (+${extra.price.toFixed(2)})
              </Text>
            ))}
          </>
        )}

        {/* Quantity Counter */}
        <QuantityCounter
          quantity={cartDish.quantity}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      </View>

      <Text className="ml-auto font-semibold">${cartDish.totalPrice.toFixed(2)}</Text>
    </View>
  );
};

export default CartDishItem;
