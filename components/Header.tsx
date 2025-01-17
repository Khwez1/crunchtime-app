import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { reverseGeocodeAsync } from 'expo-location';
import * as Location from 'expo-location';
import { router, usePathname } from 'expo-router';
import { useOrderContext } from '~/providers/OrderProvider';
import { useGlobalContext } from '~/providers/GlobalProvider';
import SearchBar from './SearchBar';

const Header = () => {
  const { activeOrder } = useOrderContext();
  const { user } = useGlobalContext();
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Fetch the current location with the highest possible accuracy
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });
        const { latitude, longitude } = currentLocation.coords;

        // Perform reverse geocoding to get detailed address information
        const geocoded = await reverseGeocodeAsync({ latitude, longitude });

        if (geocoded && geocoded.length > 0) {
          const { name, street } = geocoded[0];
          const streetAddress = [name, street].filter(Boolean).join(', ');

          // Update state with the location and address
          setAddress(streetAddress);
          setLoading(false);

          console.log('Fetched Location:', { latitude, longitude });
          console.log('Street Address:', streetAddress);
        } else {
          console.error('Reverse geocoding returned no results.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setLoading(false);
      }
    };

    fetchLocation();
  }, [user]);

  const onToggleDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View className="p-2 mt-4">
      {/* Address and Menu Icon Row */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-gray-500">Delivery Address</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Text className="text-lg font-bold">{address || 'Fetching address...'}</Text>
          )}
        </View>
        <View className='flex-row'>
          {activeOrder && (
            <TouchableOpacity className="mr-1" onPress={() => router.push('/order/order')}>
              <Ionicons name="clipboard" size={24} color="black" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onToggleDrawer}>
            <Ionicons name="menu" size={24} color="black" />
          </TouchableOpacity>
          </View>
      </View>

      {/* Search Bar */}
      <SearchBar />
    </View>
  );
};

export default Header;