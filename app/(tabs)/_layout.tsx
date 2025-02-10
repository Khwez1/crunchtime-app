import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/tabs';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide the header for all screens
        tabBarActiveTintColor: '#ffc700', // Active tab color
        tabBarInactiveTintColor: '#ccc', // Inactive tab color
        tabBarStyle: {
          backgroundColor: '#fff', // Background color of the tab bar
          borderTopWidth: 0, // Remove the top border
          marginTop: 10 // Adjust the top margin
        },
        tabBarLabelStyle: {
          fontSize: 12, // Adjust the font size
          marginBottom: 5, // Adjust the bottom margin
          fontFamily: 'Inter_400Regular', // Adjust the font family
        },
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Favorites Tab */}
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarLabel: 'favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />

      {/* Carts Tab */}
      <Tabs.Screen
        name="carts"
        options={{
          tabBarLabel: 'Carts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={28} color={color} />
          ),
        }}
      />

      {/* My Orders Tab */}
      <Tabs.Screen
        name="myOrders"
        options={{
          tabBarLabel: 'My Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}