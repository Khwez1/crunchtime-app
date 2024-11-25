import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCartContext } from '~/providers/CartProvider';
import { useOrderContext } from '~/providers/OrderProvider';
import { useState, useEffect } from 'react';
import { getRestaurant } from '~/lib/appwrite';

const Checkout = () => {
  const { id } = useLocalSearchParams(); // Extract restaurantId
  const { getCartByRestaurantId } = useCartContext();
  const { createOrder } = useOrderContext();

  const cart = getCartByRestaurantId(id);
  const [isSocialDistancing, setSocialDistancing] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [restaurant, setRestaurant] = useState(null)

  useEffect(() => {
    getRestaurant(id).then(setRestaurant)
  }, [id])

  if (!cart) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-600">Your cart is empty</Text>
        <Pressable onPress={() => router.push('/cart')}>
          <Text className="text-blue-500 mt-2 underline">Go back to cart</Text>
        </Pressable>
      </View>
    );
  }

  const calculateTotal = () => {
    try {
      const cartItems = JSON.parse(cart.cartItems || '[]'); // Default to an empty array
      const subtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  
      const deliveryFee = Number(cart.deliveryFee) || 0; // Default to 0
      const tax = Number(cart.tax) || 0; // Default to 0
      const tip = (subtotal * (Number(tipPercentage) || 0)) / 100; // Default tipPercentage to 0 if invalid
  
      const total = subtotal + deliveryFee + tax + tip;
      console.log({ subtotal, deliveryFee, tax, tip, total }); // Debug all components of the total
      return total;
    } catch (error) {
      console.error('Error calculating total:', error);
      return 0; // Return 0 if there's an error
    }
  };
  

  return (
    <ScrollView className="p-4 bg-white">
      {/* Delivery/Pick-Up Toggle */}
      <View className="flex-row mb-6">
        <Pressable
          className={`flex-1 py-2 border ${
            paymentMethod === 'Delivery' ? 'bg-yellow-500' : 'bg-gray-200'
          } rounded-l-md`}
          onPress={() => setPaymentMethod('Delivery')}
        >
          <Text className="text-center font-bold text-gray-700">Delivery</Text>
        </Pressable>
        <Pressable
          className={`flex-1 py-2 border ${
            paymentMethod === 'Pick-Up' ? 'bg-yellow-500' : 'bg-gray-200'
          } rounded-r-md`}
          onPress={() => setPaymentMethod('Pick-Up')}
        >
          <Text className="text-center font-bold text-gray-700">Pick-Up</Text>
        </Pressable>
      </View>

      {/* Delivery Address */}
      <View className="mb-6">
        <Text className="text-lg font-bold">17 B Liesbiek Park Way</Text>
        <Text className="text-gray-500 text-sm mt-1">Delivery time 25-35 minutes</Text>
        <Pressable>
          <Text className="text-blue-500 mt-2 underline">Edit Address</Text>
        </Pressable>
      </View>

      {/* Social Distancing */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-lg font-bold">Keep social distancing</Text>
        <Switch
          value={isSocialDistancing}
          onValueChange={() => setSocialDistancing(!isSocialDistancing)}
        />
      </View>

      {/* Tip Selection */}
      <View className="mb-6">
        <Text className="text-lg font-bold">Add a tip</Text>
        <View className="flex-row justify-between mt-2">
          {[0, 10, 15, 20].map((percentage) => (
            <Pressable
              key={percentage}
              className={`flex-1 mx-1 p-2 border ${
                tipPercentage === percentage ? 'bg-yellow-500' : 'bg-gray-200'
              } rounded-md`}
              onPress={() => setTipPercentage(percentage)}
            >
              <Text className="text-center">{percentage === 0 ? 'Not now' : `${percentage}%`}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Payment Summary */}
      <View className="border-t pt-4 mb-6">
        <Text className="text-base">Subtotal: US${JSON.parse(cart.cartItems).reduce((sum, item) => sum + item.totalPrice, 0)}</Text>
        <Text className="text-base">Delivery Fee: US${cart.deliveryFee}</Text>
        <Text className="text-base">Tax: US${cart.tax}</Text>
        <Text className="text-base">Tip: US${((JSON.parse(cart.cartItems).reduce((sum, item) => sum + item.totalPrice, 0) * tipPercentage) / 100)}</Text>
        <Text className="text-lg font-bold">Total: US${calculateTotal()}</Text>
      </View>

      {/* Payment Methods */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">Payment Methods</Text>
        <View className="flex-row">
          {['Card', 'Cash'].map((method) => (
            <Pressable
              key={method}
              className={`flex-1 mx-1 p-4 border ${
                paymentMethod === method ? 'border-yellow-500' : 'border-gray-300'
              } rounded-md`}
              onPress={() => setPaymentMethod(method)}
            >
              <Text className="text-center">{method}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Place Order Button */}
      <Pressable
        className="bg-red-500 py-4 rounded-md"
        onPress={async () => {
          console.log('Placing order...');
          const total = calculateTotal();
          console.log('Total calculated:', total);

          await createOrder(
            restaurant,
            cart.cartItems,
            total
          );

          console.log('Order placement complete');
        }}
      >
        <Text className="text-white text-center text-lg font-bold">
          Place Order • US${calculateTotal()}
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default Checkout;
