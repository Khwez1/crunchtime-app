import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCartContext } from '~/providers/CartProvider';
import { useOrderContext } from '~/providers/OrderProvider';
import { getRestaurant,fetchUserCards } from '~/lib/appwrite';
import { useLocalSearchParams } from 'expo-router';
import { useGlobalContext } from '~/providers/GlobalProvider';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';


const Checkout = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { getCartByRestaurantId } = useCartContext();
  const { createOrder } = useOrderContext();
  const { user, profile } = useGlobalContext();
  const [cart, setCart] = useState({ cartItems: [] });
  const [isDelivery, setIsDelivery] = useState(true);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone || '');
  const [scheduledDelivery, setScheduledDelivery] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [address, setAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const router = useRouter();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchRestaurantAndCart = async () => {
      try {
        const restaurantData = await getRestaurant(id);
        setRestaurant(restaurantData);
        console.log('Restaurant Data:', restaurantData);

        const cartData = await getCartByRestaurantId(id);
        if (cartData && cartData.cartItems) {
          cartData.cartItems = Array.isArray(cartData.cartItems) ? cartData.cartItems : JSON.parse(cartData.cartItems);
        }
        setCart(cartData || { cartItems: [] });
        console.log('Cart Data:', cartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRestaurantAndCart();
  }, [id]);

  useEffect(() => {
    console.log('User Details:', user);
    console.log('Profile Details:', profile);
  }, [user, profile]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          setLoadingAddress(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        const { latitude, longitude } = currentLocation.coords;

        const geocoded = await Location.reverseGeocodeAsync({ latitude, longitude });

        if (geocoded && geocoded.length > 0) {
          const { name, street } = geocoded[0];
          const streetAddress = [name, street].filter(Boolean).join(', ');

          setAddress(streetAddress);
          setLoadingAddress(false);

          console.log('Fetched Location:', { latitude, longitude });
          console.log('Street Address:', streetAddress);
        } else {
          console.error('Reverse geocoding returned no results.');
          setLoadingAddress(false);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setLoadingAddress(false);
      }
    };

    fetchLocation();
  }, []);

  const calculateTotal = () => {
    if (!cart || !Array.isArray(cart.cartItems)) return 0;
    const subtotal = cart.cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const deliveryFee = isDelivery ? Number(cart.deliveryFee) || 0 : 0;
    const serviceFee = Number(cart.serviceFee) || 0;
    const tip = (subtotal * (Number(tipPercentage) || 0)) / 100;
    return subtotal + deliveryFee + serviceFee + tip;
  };

  const handlePayment = async () => {
    Alert.alert(
      'Confirm Payment',
      `Proceed with payment of $${calculateTotal().toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const result = router.push({
                pathname: '/paystack/paystack',
                params: { amount: calculateTotal(), email: user?.email || '' },
              });
              if (result?.error) {
                Alert.alert("Payment Failed", "An error occurred during payment.");
              }
            } catch (error) {
              console.error("Payment navigation error:", error);
              Alert.alert("Payment Error", "Failed to navigate to payment.");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    const fetchCards = async () => {
      if (user?.id) {
        try {
          const userCards = await fetchUserCards(user.id);
          setCards(userCards);
        } catch (error) {
          console.error('Failed to fetch cards:', error);
        }
      }
    };
    fetchCards();
  }, [user]);
  
  const maskCardNumber = (number) => {
    return number.slice(-4).padStart(number.length, '*');
  };
  

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* User Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Details</Text>
        <Text>Name: {user?.name || 'Not Provided'}</Text>
        <Text>Phone: {profile?.phone || 'Not Provided'}</Text>
        <Text>Address: {profile?.address || 'Not Provided'}</Text>
      </View>

      {/* Restaurant Details */}
      {restaurant && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant Details</Text>
          <Text>Name: {restaurant.name}</Text>
          <Text>Address: {restaurant.address}</Text>
        </View>
      )}

      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        {loadingAddress ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Text style={styles.addressText}>{address || 'No address found'}</Text>
        )}
      </View>

      {/* Delivery or Pickup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery or Pickup</Text>
        <Switch
          value={isDelivery}
          onValueChange={setIsDelivery}
          trackColor={{ true: '#FF6F61', false: '#DDD' }}
        />
        <Text>{isDelivery ? 'Delivery' : 'Pickup'}</Text>
      </View>

      {/* Address and Delivery Instructions */}
      {isDelivery && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Instructions</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter delivery instructions"
              value={deliveryInstructions}
              onChangeText={setDeliveryInstructions}
            />
          </View>
        </>
      )}

      {/* Phone Number */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* Scheduled Delivery Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Scheduled Delivery</Text>
        <Switch
          value={scheduledDelivery}
          onValueChange={setScheduledDelivery}
          trackColor={{ true: '#FF6F61', false: '#DDD' }}
        />
        {scheduledDelivery && (
          <>
            <Pressable
              style={styles.editText}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>Choose Date & Time</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                display="default"
                onChange={(event, date) => {
                  if (event.type === 'set') {
                    setSelectedDate(date || selectedDate);
                  }
                  setShowDatePicker(false);
                }}
              />
            )}
          </>
        )}
      </View>

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cart && cart.cartItems && cart.cartItems.length > 0 ? (
          cart.cartItems.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text>{item.name}</Text>
              <Text>${item.totalPrice.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Your cart is empty.</Text>
        )}
      </View>

      {/* Tip Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tip Your Driver</Text>
        <View style={styles.tipRow}>
          {[0, 10, 15, 20].map((percentage) => (
            <Pressable
              key={percentage}
              style={[
                styles.tipButton,
                tipPercentage === percentage && styles.tipButtonActive,
              ]}
              onPress={() => setTipPercentage(percentage)}
            >
              <Text style={styles.tipText}>
                {percentage === 0 ? 'No Tip' : `${percentage}%`}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Cost Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cost Breakdown</Text>
        <Text style={styles.summaryText}>Subtotal: ${calculateTotal().toFixed(2)}</Text>
        <Text style={styles.summaryText}>Service Fee: ${cart.serviceFee || 0}</Text>
        <Text style={styles.summaryText}>
          Delivery Fee: ${isDelivery ? (cart.deliveryFee || 0) : 0}
        </Text>
        <Text style={styles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
  <Text style={styles.sectionTitle}>Payment Method</Text>
  <Pressable onPress={() => router.push('/(cards)/addCard')}>
    <Text style={styles.linkText}>Add New Card</Text>
  </Pressable>
  {cards.length > 0 ? (
    cards.map(card => (
      <Text key={card.$id}>{maskCardNumber(card.maskedNumber)}</Text>
    ))
  ) : (
    <Text>No saved cards</Text>
  )}
</View>

      {/* Pay Button */}
      <Pressable style={styles.orderButton} onPress={handlePayment}>
        <Text style={styles.orderButtonText}>Pay Now • ${calculateTotal().toFixed(2)}</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#FF6F61',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: '#FFF',
  },
  addressContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tipRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  tipButton: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  tipButtonActive: {
    backgroundColor: '#FF6F61',
    borderColor: '#FF6F61',
  },
  tipText: {
    color: '#333',
  },
  editText: {
    color: '#FF6F61',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 4,
    color: '#555',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 16,
  },
  orderButton: {
    backgroundColor: '#FF6F61',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingSpinner: {
    marginVertical: 8,
  },
});

export default Checkout;