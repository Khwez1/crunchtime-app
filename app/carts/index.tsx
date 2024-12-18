import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Animated } from 'react-native';
import { useCartContext } from '~/providers/CartProvider';
import { useState, useEffect, useMemo } from 'react';
import { getRestaurants } from '~/lib/appwrite';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

// Helper functions
const calculateCartTotal = (cartItems) => {
  const items = JSON.parse(cartItems);
  return items.reduce((total, item) => total + item.totalPrice, 0);
};

const handleUpdateQuantity = async (cartContext, dish, restaurantId, newQuantity, itemIndex, requiredExtras, optionalExtras) => {
  const cart = cartContext.carts.find(c => c.restaurantId === restaurantId);
  if (cart) {
    await cartContext.updateProductQuantity(dish, restaurantId, newQuantity, itemIndex, requiredExtras, optionalExtras);
  }
};

const handleDecreaseQuantity = async (cartContext, dish, restaurantId, itemIndex, requiredExtras, optionalExtras) => {
  const cart = cartContext.carts.find(c => c.restaurantId === restaurantId);
  if (cart) {
    const cartItems = JSON.parse(cart.cartItems);
    const currentItem = cartItems[itemIndex];
    if (currentItem.quantity > 1) { // Ensure quantity doesn't go below 1
      const newQuantity = currentItem.quantity - 1;
      await cartContext.updateProductQuantity(dish, restaurantId, newQuantity, itemIndex, requiredExtras, optionalExtras);
    } else {
      // Optionally, you might want to remove the item if quantity becomes 0
      await cartContext.removeProduct(dish, restaurantId, itemIndex);
    }
  }
};

const CartsPage = () => {
  const { carts, loading: cartsLoading, error: cartsError, addProduct, removeProduct, updateProductQuantity } = useCartContext();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const restaurantsData = await getRestaurants();
        setRestaurants(restaurantsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalForAllCarts = useMemo(() => 
    carts.reduce((sum, cart) => sum + calculateCartTotal(cart.cartItems), 0), 
    [carts]
  );

  if (loading || cartsLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  if (error || cartsError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{error || cartsError}</Text>
        <TouchableOpacity onPress={() => window.location.reload(false)} className="mt-4">
          <Text className="text-blue-500">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDeleteItem = async (dish, restaurantId, itemIndex) => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to remove this item from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => removeProduct(dish, restaurantId, itemIndex)
        }
      ]
    );
  };

  const renderRightActions = (progress, dragX, dish, restaurantId, itemIndex) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    
    return (
      <View style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 20 }}>
        <Animated.Text 
          style={[
            styles.deleteText,
            { transform: [{ translateX: trans }] }
          ]}
        >
          Delete
        </Animated.Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-white">
        <View className="p-4">
          <Text className="text-2xl font-bold mb-4">My Basket</Text>

          {carts.length > 0 ? (
            carts.map(cart => {
              const restaurant = restaurants.find(r => r.$id === cart.restaurantId);
              const cartItems = JSON.parse(cart.cartItems);
              const restaurantTotal = calculateCartTotal(cart.cartItems);

              return (
                <View key={cart.$id} className="mb-8">
                  <Text className="text-xl font-bold mb-2">{restaurant?.name || 'Unknown Restaurant'}</Text>
                  <Text className="text-lg text-gray-600 mb-4">
                    Total for this cart: R {restaurantTotal.toFixed(2)}
                  </Text>
                  {cartItems.map((item, index) => (
                    <Swipeable
                      key={`${cart.$id}-${index}`}
                      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item, cart.restaurantId, index)}
                      onSwipeableRightOpen={() => handleDeleteItem(item, cart.restaurantId, index)}
                    >
                      <View className="bg-white rounded-lg shadow-md p-4 mb-4 flex-row justify-between items-center">
                        <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 8 }} />
                        <View className="flex-1 ml-4">
                          <Text className="text-lg font-semibold">{item.name}</Text>
                          <Text className="text-gray-600">{item.category}</Text>
                          <Text className="text-green-500">Free delivery</Text>
                        </View>
                        <View className="flex-row items-center">
                          <TouchableOpacity 
                            accessibilityLabel="Decrease quantity"
                            className="p-1 rounded bg-gray-200 mr-2" 
                            onPress={() => handleDecreaseQuantity({carts, updateProductQuantity, removeProduct}, item, cart.restaurantId, index, item.requiredExtras, item.optionalExtras)}
                          >
                            <Text className="text-lg">-</Text>
                          </TouchableOpacity>
                          <Text className="text-lg font-semibold">{item.quantity}</Text>
                          <TouchableOpacity 
                            accessibilityLabel="Increase quantity"
                            className="p-1 rounded bg-red-500 ml-2" 
                            onPress={() => handleUpdateQuantity({carts, updateProductQuantity}, item, cart.restaurantId, item.quantity + 1, index, item.requiredExtras, item.optionalExtras)}
                          >
                            <Text className="text-white text-lg">+</Text>
                          </TouchableOpacity>
                        </View>
                        <Text className="text-lg font-semibold ml-4">R {item.price}</Text>
                      </View>
                    </Swipeable>
                  ))}
                </View>
              );
            })
          ) : (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-500 text-lg">
                You have no items in your cart.
              </Text>
            </View>
          )}
          <View className="p-4 flex-row items-center justify-between">
            <Text className="text-2xl font-bold">Total: R {totalForAllCarts.toFixed(2)}</Text>
            <TouchableOpacity className="bg-red-500 p-3 rounded-lg">
              <Text className="text-white font-semibold">Go to Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = {
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    transform: [{ scaleX: -1 }] // This will flip the text to read right to left for a nice effect
  },
};

export default CartsPage;