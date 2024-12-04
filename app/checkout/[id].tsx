import {
  View,
  Text,
  Pressable,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCartContext } from "~/providers/CartProvider";
import { useOrderContext } from "~/providers/OrderProvider";
import { useState, useEffect } from "react";
import { getRestaurant } from "~/lib/appwrite";

const Checkout = () => {
  const { id } = useLocalSearchParams(); // Extract restaurantId
  const { getCartByRestaurantId } = useCartContext();
  const { createOrder } = useOrderContext();

  const cart = getCartByRestaurantId(id);
  const [isSocialDistancing, setSocialDistancing] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    if (id) {
      getRestaurant(id)
        .then(setRestaurant)
        .catch((error) =>
          console.error("Error fetching restaurant:", error)
        );
    }
  }, [id]);

  

  if (!cart) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-600">Your cart is empty</Text>
        <Pressable onPress={() => router.push("/cart")}>
          <Text className="text-blue-500 mt-2 underline">Go back to cart</Text>
        </Pressable>
      </View>
    );
  }

  const calculateTotal = () => {
    try {
      const cartItems = JSON.parse(cart.cartItems || "[]");
      console.log("Cart:", cart);
console.log("Cart Items:", cartItems);

      const subtotal = cartItems.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0
      );
      const deliveryFee = Number(cart.deliveryFee) || 0;
      const tax = Number(cart.tax) || 0;
      const tip = (subtotal * (Number(tipPercentage) || 0)) / 100;
      return subtotal + deliveryFee + tax + tip;
    } catch (error) {
      console.error("Error calculating total:", error);
      Alert.alert("Error", "Failed to calculate total amount.");
      return 0;
    }
  };

  const handlePlaceOrder = async () => {
    const total = calculateTotal();
    if (total <= 0) {
      Alert.alert("Error", "Invalid total amount.");
      return;
    }

    try {
      await createOrder(restaurant, cart.cartItems, total, cart.$id);
      Alert.alert("Success", "Order placed successfully!");
      router.replace("/order-success"); // Navigate to order success screen
    } catch (error) {
      console.error("Error placing order:", error);
      Alert.alert("Error", "Failed to place the order. Please try again.");
    }
  };

  const handlePaystackPayment = () => {
    const total = calculateTotal();
    if (total <= 0) {
      Alert.alert("Error", "Invalid total amount.");
      return;
    }

    // Redirect to PaymentScreen with required details
    router.push({
      pathname: "/checkout/[payment]",
      params: {
        amount: total,
        email: "customer_email@example.com", // Replace with the user's email
      },
    });
  };

  return (
    <ScrollView className="p-4 bg-white">
      {/* Delivery Address */}
      <View className="mb-6">
        <Text className="text-lg font-bold">Delivery Address</Text>
        <Text className="text-gray-500 text-sm mt-1">
          17 B Liesbiek Park Way
        </Text>
        <Text className="text-gray-500 text-sm">Delivery time: 25-35 min</Text>
        <Pressable>
          <Text className="text-blue-500 mt-2 underline">Edit Address</Text>
        </Pressable>
      </View>

      {/* Social Distancing */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-lg font-bold">Social Distancing</Text>
        <Switch
          value={isSocialDistancing}
          onValueChange={() => setSocialDistancing(!isSocialDistancing)}
        />
      </View>

      {/* Tip Selection */}
      <View className="mb-6">
        <Text className="text-lg font-bold">Add a Tip</Text>
        <View className="flex-row justify-between mt-2">
          {[0, 10, 15, 20].map((percentage) => (
            <Pressable
              key={percentage}
              className={`flex-1 mx-1 p-2 border ${
                tipPercentage === percentage
                  ? "bg-yellow-500"
                  : "bg-gray-200"
              } rounded-md`}
              onPress={() => setTipPercentage(percentage)}
            >
              <Text className="text-center">
                {percentage === 0 ? "No Tip" : `${percentage}%`}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Payment Summary */}
      <View className="border-t pt-4 mb-6">
        <Text className="text-base">
          Subtotal: US$
          {JSON.parse(cart.cartItems).reduce(
            (sum, item) => sum + item.totalPrice,
            0
          )}
        </Text>
        <Text className="text-base">Delivery Fee: US${cart.deliveryFee}</Text>
        <Text className="text-base">Tax: US${cart.tax}</Text>
        <Text className="text-base">
          Tip: US$
          {(
            (JSON.parse(cart.cartItems).reduce(
              (sum, item) => sum + item.totalPrice,
              0
            ) *
              tipPercentage) /
            100
          ).toFixed(2)}
        </Text>
        <Text className="text-lg font-bold">
          Total: US${calculateTotal().toFixed(2)}
        </Text>
      </View>

      {/* Payment Method */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2">Payment Method</Text>
        <View className="flex-row">
          {["Card", "Cash"].map((method) => (
            <Pressable
              key={method}
              className={`flex-1 mx-1 p-4 border ${
                paymentMethod === method
                  ? "border-yellow-500"
                  : "border-gray-300"
              } rounded-md`}
              onPress={() => setPaymentMethod(method)}
            >
              <Text className="text-center">{method}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Manage Payment Methods */}
      <Pressable
        className="bg-blue-500 py-4 mb-4 rounded-md"
        onPress={() => router.push("/checkout/manageCards")}
      >
        <Text className="text-white text-center text-lg font-bold">
          Manage Payment Methods
        </Text>
      </Pressable>

      {/* Pay Now Button */}
      <Pressable
        className="bg-green-500 py-4 mb-4 rounded-md"
        onPress={handlePaystackPayment}
      >
        <Text className="text-white text-center text-lg font-bold">
          Pay Now • US${calculateTotal().toFixed(2)}
        </Text>
      </Pressable>

      {/* Place Order Button */}
      <Pressable
        className="bg-red-500 py-4 rounded-md"
        onPress={handlePlaceOrder}
      >
        <Text className="text-white text-center text-lg font-bold">
          Place Order
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default Checkout;
