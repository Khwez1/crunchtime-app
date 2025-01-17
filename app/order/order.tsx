import { View, Text, useWindowDimensions, TextInput, TouchableOpacity, Pressable } from 'react-native';
import Mapbox, { MapView, Camera, LocationPuck, PointAnnotation, Callout } from '@rnmapbox/maps';
import { Fontisto } from '@expo/vector-icons';
import { useOrderContext } from '~/providers/OrderProvider';
import { ProgressBar } from 'react-native-paper'; // Install via `npm install react-native-paper`
import { router } from 'expo-router';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function orderScreen() {
  const { activeOrder, driver } = useOrderContext();
  const { width, height } = useWindowDimensions();

  if (!activeOrder) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading active order...</Text>
      </View>
    );
  }

  const isDriverAvailable = driver?.latitude && driver?.longitude;

  // Order Status Mapping
  const orderStatusMessages = {
    NEW: 'Your order has been placed!',
    COOKING: 'The restaurant is preparing your order.',
    READY_FOR_PICKUP: 'Your order is ready for pickup.',
    PICKED_UP: 'The driver has picked up your order.',
    ACCEPTED: 'The driver has accepted your order.',
    COMPLETED: 'Your order has been delivered!',
  };

  const progressStages = {
    NEW: 0.1,
    COOKING: 0.3,
    READY_FOR_PICKUP: 0.5,
    PICKED_UP: 0.7,
    ACCEPTED: 0.9,
    COMPLETED: 1.0,
  };

  const orderStatusMessage = orderStatusMessages[activeOrder.orderStatus] || 'Processing your order...';
  const progress = progressStages[activeOrder.orderStatus] || 0;

  return (
    <View className="flex-1 bg-gray-100">
      {/* Status Section */}
      <View className="p-4 bg-white shadow-md">
        <Text className="text-lg font-bold text-gray-800">{orderStatusMessage}</Text>
        <ProgressBar progress={progress} color="#4CAF50" style={{ height: 10, borderRadius: 5 }} />
      </View>

      {/* Map Section */}
      {isDriverAvailable ? (
        <View className="flex-1 h-1/2 rounded-b-2xl overflow-hidden shadow-lg bg-white mt-4">
          <MapView style={{ width, height }} styleURL="mapbox://styles/mapbox/streets-v11">
            <Camera followZoomLevel={14} followUserLocation />
            <LocationPuck puckBearingEnabled puckBearing="course" pulsing={{ isEnabled: true }} />

            {/* Restaurant Location */}
            {activeOrder.restaurant[0] && (
              <PointAnnotation
                id={`restaurant-${activeOrder.$id}`}
                coordinate={[
                  activeOrder.restaurant[0].lng,
                  activeOrder.restaurant[0].lat,
                ]}
              >
                <View className="bg-red-500 p-2 rounded-full">
                  <Fontisto name="shopping-store" size={20} color="white" />
                </View>
                <Callout title={activeOrder.restaurant[0].name} />
              </PointAnnotation>
            )}

            {/* Driver Location */}
            <PointAnnotation
              id={`driver-${driver.$id}`}
              coordinate={[driver.longitude, driver.latitude]}
            >
              <View className="bg-blue-500 p-2 rounded-full">
                <Fontisto name="motorcycle" size={20} color="white" />
              </View>
              <Callout title="Driver's Location" />
            </PointAnnotation>
          </MapView>
        </View>
      ) : (
        <View className="h-1/2 flex justify-center items-center rounded-b-2xl bg-gray-200 mt-4">
          <Text className="text-gray-500">Waiting for driver data...</Text>
        </View>
      )}

      {/* Chat and OTP Section */}
      <View className="flex-1 px-4 py-4 space-y-4">
        {/* OTP Section */}
        <View className="bg-white p-4 rounded-lg shadow">
          <Text className="text-lg font-bold text-gray-800">Your OTP: {activeOrder.otp}</Text>
        </View>

        {/* Chat Section */}
        <Pressable className="flex-1 bg-white rounded-lg shadow p-4" onPress={()=> router.push('/Room')}>
          <Text className="text-lg font-bold text-gray-800 mb-2">Chat with Driver</Text>
          <View className="flex-1 bg-gray-100 p-2 rounded-lg">
            {/* Add dynamic chat messages here */}
            <Text className="text-gray-500 text-center">No messages yet.</Text>
          </View>
          <View className="flex-row items-center mt-4">
            <TextInput
              placeholder="Type a message..."
              className="flex-1 h-10 border border-gray-300 rounded-full px-4 bg-gray-50"
            />
            <TouchableOpacity className="ml-2 bg-blue-500 px-4 py-2 rounded-full">
              <Text className="text-white text-sm">Send</Text>
            </TouchableOpacity>
          </View>
        </Pressable>

      </View>
    </View>
  );
}
